import { useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createAudioPreprocessor } from "@/services/audio";
import { voiceIdentificationService } from "@/services/voiceIdentificationService";
import { playIdentificationPrompt } from "@/services/audioService";
import { setupSystemAudio } from "@/services/audio/systemAudioService";
import { setupSpeechRecognition } from "@/services/audio/speechRecognitionService";
import { validateApiKey, setupMicrophoneStream } from "@/services/audio/recordingSetupService";

interface UseAudioRecordingProps {
  onDataAvailable: (data: BlobPart) => void;
  transcriptionService: 'openai' | 'google';
  apiKey: string;
  systemAudioEnabled?: boolean;
}

export const useAudioRecording = ({ 
  onDataAvailable, 
  transcriptionService, 
  apiKey,
  systemAudioEnabled = false
}: UseAudioRecordingProps) => {
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const audioPreprocessorRef = useRef<ReturnType<typeof createAudioPreprocessor> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleBackgroundNoise = useCallback((isNoisy: boolean) => {
    if (isNoisy) {
      toast({
        title: "Aviso de Ruído",
        description: "Foi detectado muito ruído de fundo. Isso pode afetar a qualidade da transcrição.",
        duration: 3000,
      });
    }
  }, [toast]);

  const startRecording = useCallback(async (identificationEnabled: boolean) => {
    if (!validateApiKey(apiKey, transcriptionService)) return null;

    try {
      if (identificationEnabled) {
        voiceIdentificationService.clear();
        await playIdentificationPrompt();
      }

      audioPreprocessorRef.current = createAudioPreprocessor();
      audioPreprocessorRef.current.setNoiseCallback(handleBackgroundNoise);
      audioContextRef.current = new AudioContext();

      const micStream = await setupMicrophoneStream();
      let finalStream: MediaStream;

      if (systemAudioEnabled) {
        const result = await setupSystemAudio(micStream, audioContextRef.current);
        finalStream = result.stream;
        if (result.cleanup) {
          cleanupRef.current = result.cleanup;
        }
      } else {
        finalStream = micStream;
      }

      const processedStream = await audioPreprocessorRef.current.processAudioStream(finalStream);
      const recorder = new MediaRecorder(processedStream);
      const recognition = setupSpeechRecognition();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          onDataAvailable(event.data);
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      speechRecognitionRef.current = recognition;
      recognition.start();

      return { recorder, recognition };
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone ou o áudio do sistema.",
        variant: "destructive",
      });
      return null;
    }
  }, [apiKey, transcriptionService, handleBackgroundNoise, onDataAvailable, toast, systemAudioEnabled]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      if (audioPreprocessorRef.current) {
        audioPreprocessorRef.current.dispose();
        audioPreprocessorRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      mediaRecorderRef.current = null;
      speechRecognitionRef.current = null;
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      toast({
        title: "Gravação pausada",
        description: "A gravação foi pausada. Clique em retomar para continuar.",
      });
    }
  }, [toast]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.start();
      }
      toast({
        title: "Gravação retomada",
        description: "A gravação foi retomada.",
      });
    }
  }, [toast]);

  return {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
};