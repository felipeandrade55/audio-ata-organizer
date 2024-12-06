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
        description: `Por favor, configure sua chave da API ${transcriptionService === 'openai' ? 'OpenAI' : 'Google Cloud'} nas variáveis de ambiente.`,
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

      const constraints: MediaStreamConstraints = {
        audio: {
          sampleRate: 48000,
          channelCount: 2,
          ...(systemAudioEnabled && { systemAudio: 'include' as any })
        }
      };

      const rawStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Se o áudio do sistema estiver habilitado, tenta capturar o áudio do sistema
      let systemAudioStream: MediaStream | null = null;
      if (systemAudioEnabled) {
        try {
          // @ts-ignore - TypeScript não reconhece essa API experimental
          systemAudioStream = await navigator.mediaDevices.getDisplayMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              sampleRate: 48000,
            },
            video: false
          });
        } catch (error) {
          console.error('Erro ao capturar áudio do sistema:', error);
          toast({
            title: "Aviso",
            description: "Não foi possível capturar o áudio do sistema. Apenas o microfone será gravado.",
            duration: 5000,
          });
        }
      }

      let finalStream = rawStream;
      if (systemAudioStream) {
        const audioContext = new AudioContext();
        const micSource = audioContext.createMediaStreamSource(rawStream);
        const systemSource = audioContext.createMediaStreamSource(systemAudioStream);
        const destination = audioContext.createMediaStreamDestination();

        micSource.connect(destination);
        systemSource.connect(destination);
        finalStream = destination.stream;
      }

      const processedStream = await audioPreprocessorRef.current.processAudioStream(finalStream);
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