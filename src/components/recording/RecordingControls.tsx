import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Pause, Play } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  isTranscribing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResu

Vou melhorar a interface do sistema tornando-a mais moderna, adicionando animações suaves, melhor uso de cores e uma experiência mais agradável.

<lov-code>
Vamos atualizar os componentes principais para uma interface mais moderna:

<lov-write file_path="src/components/recording/RecordingContainer.tsx">
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApiKeyInput from "./ApiKeyInput";
import RecordingControls from "./RecordingControls";
import TranscriptionSummary from "./TranscriptionSummary";
import IdentificationSwitch from "./IdentificationSwitch";
import { useRecording } from "@/hooks/useRecording";
import { motion } from "framer-motion";

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
      <div className="container mx-auto p-4 max-w-4xl pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Ata de Reunião - {formatDate(new Date())}
              </CardTitle>
              <p className="text-center text-sm text-muted-foreground">
                Grave e transcreva suas reuniões automaticamente
              </p>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="flex flex-col items-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-full space-y-4">
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
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <TranscriptionSummary
                      duration={getTotalDuration()}
                      participantCount={getParticipantCount()}
                      onViewFullTranscription={viewFullTranscription}
                    />
                  </motion.div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RecordingContainer;