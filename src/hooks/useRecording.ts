import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useTranscriptionHandler } from "./useTranscriptionHandler";
import { useAudioRecording } from "./useAudioRecording";
import { MeetingMinutes } from "@/types/meeting";
import { TranscriptionSegment } from "@/types/transcription";

interface UseRecordingProps {
  apiKey: string;
  transcriptionService: 'openai' | 'google';
  minutes?: MeetingMinutes;
  onMinutesUpdate?: (minutes: MeetingMinutes) => void;
  beforeTranscriptionStart?: () => Promise<boolean>;
}

export const useRecording = ({ 
  apiKey, 
  transcriptionService, 
  minutes, 
  onMinutesUpdate,
  beforeTranscriptionStart 
}: UseRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionSegments, setTranscriptionSegments] = useState<TranscriptionSegment[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);
  const { toast } = useToast();

  const { handleTranscription } = useTranscriptionHandler({
    apiKey,
    transcriptionService,
    setIsTranscribing,
    setTranscriptionSegments,
    recordingStartTime,
    minutes,
    onMinutesUpdate,
  });

  const handleDataAvailable = useCallback((data: BlobPart) => {
    setAudioChunks(prev => [...prev, data]);
  }, []);

  const {
    startRecording: startAudioRecording,
    stopRecording: stopAudioRecording,
    pauseRecording: pauseAudioRecording,
    resumeRecording: resumeAudioRecording,
  } = useAudioRecording({
    onDataAvailable: handleDataAvailable,
    transcriptionService,
    apiKey,
  });

  const startRecording = async (identificationEnabled: boolean) => {
    const result = await startAudioRecording(identificationEnabled);
    if (result) {
      setRecordingStartTime(Date.now());
      setIsRecording(true);
      setIsPaused(false);
      setAudioChunks([]);
      toast({
        title: "Gravação iniciada",
        description: "O áudio está sendo pré-processado para melhor qualidade.",
      });
    }
  };

  const stopRecording = async () => {
    stopAudioRecording();
    setIsRecording(false);
    setIsPaused(false);
    setRecordingStartTime(null);
    
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    
    // Check transcription limit before proceeding
    if (beforeTranscriptionStart) {
      const canProceed = await beforeTranscriptionStart();
      if (!canProceed) {
        setAudioChunks([]);
        return;
      }
    }
    
    await handleTranscription(audioBlob);
    setAudioChunks([]);
  };

  const pauseRecording = () => {
    pauseAudioRecording();
    setIsPaused(true);
  };

  const resumeRecording = () => {
    resumeAudioRecording();
    setIsPaused(false);
  };

  return {
    isRecording,
    isPaused,
    isTranscribing,
    transcriptionSegments,
    recordingStartTime,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
};