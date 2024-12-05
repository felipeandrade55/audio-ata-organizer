import { useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createAudioPreprocessor } from "@/services/audio";
import { voiceIdentificationService } from "@/services/voiceIdentificationService";
import { handleNameRecognition } from "@/services/nameRecognitionService";
import { playIdentificationPrompt } from "@/services/audioService";

interface UseAudioRecordingProps {
  onDataAvailable: (data: BlobPart) => void;
  transcriptionService: 'openai' | 'google';
  apiKey: string;
}

export const useAudioRecording = ({ onDataAvailable, transcriptionService, apiKey }: UseAudioRecordingProps) => {
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const audioPreprocessorRef = useRef<ReturnType<typeof createAudioPreprocessor> | null>(null);

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
    if (!apiKey) {
      toast({
        title: "Erro",
        description: `Por favor, insira sua chave da API ${transcriptionService === 'openai' ? 'OpenAI' : 'Google Cloud'} primeiro.`,
        variant: "destructive",
      });
      return null;
    }

    try {
      if (identificationEnabled) {
        voiceIdentificationService.clear();
        await playIdentificationPrompt();
      }

      audioPreprocessorRef.current = createAudioPreprocessor();
      audioPreprocessorRef.current.setNoiseCallback(handleBackgroundNoise);

      const rawStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          channelCount: 2,
        }
      });

      const processedStream = await audioPreprocessorRef.current.processAudioStream(rawStream);
      const recorder = new MediaRecorder(processedStream);
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const name = handleNameRecognition(transcript);

          if (name && !voiceIdentificationService.profiles.find(p => p.name === name)) {
            voiceIdentificationService.addProfile(name, new Float32Array(0));
            toast({
              title: "Novo participante identificado",
              description: `Identificamos o participante: ${name}`,
            });
          }
        }
      };

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
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone.",
        variant: "destructive",
      });
      return null;
    }
  }, [apiKey, transcriptionService, handleBackgroundNoise, onDataAvailable, toast]);

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