import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApiKeyInput from "./ApiKeyInput";
import RecordingControls from "./RecordingControls";
import TranscriptionSummary from "./TranscriptionSummary";
import IdentificationSwitch from "./IdentificationSwitch";
import { useRecording } from "@/hooks/useRecording";
import { TranscriptionSegment } from "@/types/transcription";

const RecordingContainer = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [identificationEnabled, setIdentificationEnabled] = useState(false);
  
  const {
    isRecording,
    isPaused,
    isTranscribing,
    transcriptionSegments,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useRecording(apiKey);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTotalDuration = () => {
    if (transcriptionSegments.length === 0) return "0:00";
    const lastSegment = transcriptionSegments[transcriptionSegments.length - 1];
    return lastSegment.timestamp;
  };

  const getParticipantCount = () => {
    const uniqueSpeakers = new Set(transcriptionSegments.map(segment => segment.speaker));
    return uniqueSpeakers.size;
  };

  const viewFullTranscription = () => {
    navigate("/transcription", {
      state: {
        segments: transcriptionSegments,
        date: formatDate(new Date())
      }
    });
  };

  const handleStartRecording = () => startRecording(identificationEnabled);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Ata de Reunião - {formatDate(new Date())}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="w-full">
              <ApiKeyInput apiKey={apiKey} onChange={setApiKey} />
              <IdentificationSwitch
                enabled={identificationEnabled}
                onToggle={setIdentificationEnabled}
              />
            </div>

            <RecordingControls
              isRecording={isRecording}
              isPaused={isPaused}
              isTranscribing={isTranscribing}
              onStartRecording={handleStartRecording}
              onStopRecording={stopRecording}
              onPauseRecording={pauseRecording}
              onResumeRecording={resumeRecording}
            />

            {transcriptionSegments.length > 0 && (
              <TranscriptionSummary
                duration={getTotalDuration()}
                participantCount={getParticipantCount()}
                onViewFullTranscription={viewFullTranscription}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordingContainer;