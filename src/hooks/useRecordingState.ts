import { useState } from "react";
import { TranscriptionSegment } from "@/types/transcription";

export const useRecordingState = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionSegments, setTranscriptionSegments] = useState<TranscriptionSegment[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);

  return {
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
  };
};