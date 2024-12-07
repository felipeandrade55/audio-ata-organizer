import { useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { createAudioPreprocessor } from "@/services/audio";
import { voiceIdentificationService } from "@/services/voiceIdentificationService";
import { playIdentificationPrompt } from "@/services/audioService";
import { setupSystemAudio } from "@/services/audio/systemAudioService";
import { setupSpeechRecognition } from "@/services/audio/speechRecognitionService";
import { validateApiKey, setupMicrophoneStream } from "@/services/audio/recordingSetupService";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

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
  const audioChunksRef = useRef<BlobPart[]>([]);
  const currentSizeRef = useRef<number>(0);

  const startRecording = useCallback(async (identificationEnabled: boolean) => {
    if (!validateApiKey(apiKey, transcriptionService)) return null;

    try {
      if (identificationEnabled) {
        voiceIdentificationService.clear();
        await playIdentificationPrompt();
      }

      audioPreprocessorRef.current = createAudioPreprocessor();
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
      const recorder = new MediaRecorder(processedStream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000 // Compress audio to 128kbps
      });
      
      audioChunksRef.current = [];
      currentSizeRef.current = 0;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          currentSizeRef.current += event.data.size;

          if (currentSizeRef.current > MAX_FILE_SIZE) {
            stopRecording();
            toast({
              title: "Limite de tamanho excedido",
              description: "A gravação foi interrompida pois excedeu o limite de 10MB. Por favor, faça gravações mais curtas.",
              variant: "destructive",
            });
            return;
          }

          onDataAvailable(event.data);
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      
      const recognition = setupSpeechRecognition();
      speechRecognitionRef.current = recognition;
      recognition.start();

      return { recorder, recognition };
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível acessar o microfone ou o áudio do sistema.",
      });
      return null;
    }
  }, [apiKey, transcriptionService, onDataAvailable, systemAudioEnabled, toast]);

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
      audioChunksRef.current = [];
      currentSizeRef.current = 0;
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