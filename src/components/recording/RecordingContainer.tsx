import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import RecordingHeader from "./RecordingHeader";
import RecordingConfig from "./RecordingConfig";
import RecordingControls from "./RecordingControls";
import TranscriptionSummary from "./TranscriptionSummary";
import { useRecording } from "@/hooks/useRecording";
import { MeetingMinutes } from "@/types/meeting";
import { supabase } from "@/integrations/supabase/client";

const RecordingContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [identificationEnabled, setIdentificationEnabled] = useState(false);
  const [transcriptionService, setTranscriptionService] = useState<'openai' | 'google'>('openai');
  const [minutes, setMinutes] = useState<MeetingMinutes>({
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

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log('Fetching API key for service:', transcriptionService);
        const { data, error } = await supabase
          .from('api_keys')
          .select('api_key')
          .eq('service', transcriptionService)
          .single();

        if (error) {
          console.error('Error fetching API key:', error);
          throw error;
        }

        if (!data?.api_key) {
          console.error('No API key found for service:', transcriptionService);
          throw new Error(`No API key found for ${transcriptionService}`);
        }

        console.log(`${transcriptionService} API key found with length:`, data.api_key.length);
        setApiKey(data.api_key);
      } catch (error) {
        console.error('Error fetching API key:', error);
        toast({
          title: "Erro na Configuração",
          description: `Chave da API ${transcriptionService} não encontrada ou inválida. Por favor, verifique a configuração.`,
          variant: "destructive",
        });
        setApiKey('');
      }
    };

    fetchApiKey();
  }, [transcriptionService, toast]);
  
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
    apiKey,
    transcriptionService,
    minutes,
    onMinutesUpdate: setMinutes
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

  const handleStartRecording = () => {
    if (!apiKey) {
      toast({
        title: "Erro de Configuração",
        description: `Por favor, configure a chave da API ${transcriptionService} antes de iniciar a gravação.`,
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
              <RecordingConfig
                identificationEnabled={identificationEnabled}
                transcriptionService={transcriptionService}
                onIdentificationToggle={setIdentificationEnabled}
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