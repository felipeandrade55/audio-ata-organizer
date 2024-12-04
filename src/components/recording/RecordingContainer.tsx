import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApiKeyInput from "./ApiKeyInput";
import RecordingControls from "./RecordingControls";
import TranscriptionSummary from "./TranscriptionSummary";
import IdentificationSwitch from "./IdentificationSwitch";
import { useRecording } from "@/hooks/useRecording";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-xl border-0 ring-1 ring-gray-200 dark:ring-gray-800">
          <CardHeader className="space-y-2">
            <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Ata de Reunião
            </CardTitle>
            <p className="text-center text-gray-500 dark:text-gray-400">
              {formatDate(new Date())}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              <div className="w-full space-y-4 animate-fade-in">
                <ApiKeyInput apiKey={apiKey} onChange={setApiKey} />
                <IdentificationSwitch
                  enabled={identificationEnabled}
                  onToggle={setIdentificationEnabled}
                />
              </div>

              <div className="w-full max-w-md mx-auto animate-fade-in">
                <RecordingControls
                  isRecording={isRecording}
                  isPaused={isPaused}
                  isTranscribing={isTranscribing}
                  onStartRecording={handleStartRecording}
                  onStopRecording={stopRecording}
                  onPauseRecording={pauseRecording}
                  onResumeRecording={resumeRecording}
                />
              </div>

              {transcriptionSegments.length > 0 && (
                <div className="w-full animate-fade-in">
                  <TranscriptionSummary
                    duration={getTotalDuration()}
                    participantCount={getParticipantCount()}
                    onViewFullTranscription={viewFullTranscription}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecordingContainer;