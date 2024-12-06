import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import RecordingHeader from "./RecordingHeader";
import RecordingConfig from "./RecordingConfig";
import RecordingControls from "./RecordingControls";
import TranscriptionSummary from "./TranscriptionSummary";
import IdentificationSwitch from "./IdentificationSwitch";
import SystemAudioSwitch from "./SystemAudioSwitch";
import { useRecording } from "@/hooks/useRecording";
import { useTranscriptionLimit } from "@/hooks/useTranscriptionLimit";
import { MeetingMinutes } from "@/types/meeting";

const RecordingContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkTranscriptionLimit } = useTranscriptionLimit();
  const [identificationEnabled, setIdentificationEnabled] = useState(false);
  const [systemAudioEnabled, setSystemAudioEnabled] = useState(false);
  const [transcriptionService, setTranscriptionService] = useState<'openai' | 'google'>('openai');
  const [minutes, setMinutes] = useState<MeetingMinutes>({
    id: crypto.randomUUID(),
    date: new Date().toLocaleDateString('pt-BR'),
    startTime: new Date().toLocaleTimeString('pt-BR'),
    endTime: '',
    location: 'Virtual - Gravação de Áudio',
    meetingTitle: '',
    organizer: '',
    participants: [],
    agendaItems: [],
    actionItems: [],
    summary: '',
    nextSteps: [],
    author: 'Sistema de Transcrição',
    meetingType: 'initial',
    confidentialityLevel: 'internal',
    legalReferences: [],
    version: 1,
    status: 'draft',
    lastModified: new Date().toISOString(),
    tags: []
  });

  const {
    isRecording,
    isPaused,
    isTranscribing,
    transcriptionSegments,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    recordingStartTime,
  } = useRecording({
    apiKey: localStorage.getItem(`${transcriptionService}_api_key`) || '',
    transcriptionService,
    minutes,
    onMinutesUpdate: setMinutes,
    beforeTranscriptionStart: checkTranscriptionLimit,
    systemAudioEnabled
  });

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
        date: formatDate(new Date()),
        minutes,
      }
    });
  };

  const handleStartRecording = async () => {
    const apiKey = localStorage.getItem(`${transcriptionService}_api_key`);
    if (!apiKey || apiKey.trim() === '') {
      toast({
        title: "Configuração Necessária",
        description: `Por favor, configure uma chave de API válida para ${transcriptionService === 'openai' ? 'OpenAI' : 'Google Cloud'} nas configurações antes de iniciar a gravação.`,
        variant: "destructive",
      });
      return;
    }
    startRecording(identificationEnabled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-xl border-0 ring-1 ring-gray-200 dark:ring-gray-800">
          <RecordingHeader date={formatDate(new Date())} />
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              <div className="w-full max-w-md space-y-4">
                <IdentificationSwitch
                  enabled={identificationEnabled}
                  onToggle={setIdentificationEnabled}
                />
                <SystemAudioSwitch
                  enabled={systemAudioEnabled}
                  onToggle={setSystemAudioEnabled}
                />
              </div>

              <RecordingConfig
                transcriptionService={transcriptionService}
                onServiceChange={setTranscriptionService}
              />

              <div className="w-full max-w-md mx-auto animate-fade-in">
                <RecordingControls
                  isRecording={isRecording}
                  isPaused={isPaused}
                  isTranscribing={isTranscribing}
                  startTime={recordingStartTime}
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
                    isTranscribing={isTranscribing}
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