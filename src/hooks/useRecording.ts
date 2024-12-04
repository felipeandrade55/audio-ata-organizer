import { useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { voiceIdentificationService } from "@/services/voiceIdentificationService";
import { playIdentificationPrompt } from "@/services/audioService";
import { handleNameRecognition } from "@/services/nameRecognitionService";
import { useRecordingState } from "./useRecordingState";
import { useTranscriptionHandler } from "./useTranscriptionHandler";
import { MeetingMinutes } from "@/types/meeting";

interface UseRecordingProps {
  apiKey: string;
  minutes?: MeetingMinutes;
  onMinutesUpdate?: (minutes: MeetingMinutes) => void;
}

export const useRecording = ({ apiKey, minutes, onMinutesUpdate }: UseRecordingProps) => {
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const recordingState = useRecordingState();

  const {
    isRecording,
    setIsRecording,
    isPaused,
    setIsPaused,
    isTranscribing,
    setIsTranscribing,
    transcriptionSegments,
    setTranscriptionSegments,
    recordingStartTime,
    setRecordingStartTime,
  } = recordingState;

  const { handleTranscription } = useTranscriptionHandler({
    apiKey,
    setIsTranscribing,
    setTranscriptionSegments,
    recordingStartTime,
    minutes,
    onMinutesUpdate,
  });

  const startRecording = useCallback(async (identificationEnabled: boolean) => {
    if (!apiKey) {
      toast({
        title: "Erro",
        description: "Por favor, insira sua chave da API OpenAI primeiro.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (identificationEnabled) {
        voiceIdentificationService.clear();
        await playIdentificationPrompt();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
        }
      });

      const audioChunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream);
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
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        await handleTranscription(audioBlob);
      };

      recorder.start(1000);
      setRecordingStartTime(Date.now());
      mediaRecorderRef.current = recorder;
      speechRecognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone.",
        variant: "destructive",
      });
    }
  }, [apiKey, handleTranscription, toast, setIsRecording, setIsPaused, setRecordingStartTime]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsRecording(false);
      setIsPaused(false);
      mediaRecorderRef.current = null;
      speechRecognitionRef.current = null;
      setRecordingStartTime(null);
    }
  }, [setIsRecording, setIsPaused, setRecordingStartTime]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsPaused(true);
      toast({
        title: "Gravação pausada",
        description: "A gravação foi pausada. Clique em retomar para continuar.",
      });
    }
  }, [toast, setIsPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.start();
      }
      setIsPaused(false);
      toast({
        title: "Gravação retomada",
        description: "A gravação foi retomada.",
      });
    }
  }, [toast, setIsPaused]);

  return {
    isRecording,
    isPaused,
    isTranscribing,
    transcriptionSegments,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
};