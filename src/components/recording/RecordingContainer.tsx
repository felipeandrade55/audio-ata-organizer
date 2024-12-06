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
import { RecordingHistorySection } from "@/components/history/RecordingHistorySection";
import { MeetingHistorySection } from "@/components/history/MeetingHistorySection";
import { useMeetings } from "@/hooks/useMeetings";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

declare global {
  interface Window {
    systemAudioEnabled: boolean;
  }
}

const RecordingContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSupabase();
  const { checkTranscriptionLimit } = useTranscriptionLimit();
  const [identificationEnabled, setIdentificationEnabled] = useState(false);
  const [systemAudioEnabled, setSystemAudioEnabled] = useState(false);
  const [transcriptionService, setTranscriptionService] = useState<'openai' | 'google'>('openai');
  const [meetingSearch, setMeetingSearch] = useState("");
  const [meetingType, setMeetingType] = useState<string>("all");
  const [recordingDateRange, setRecordingDateRange] = useState<string>("all");
  
  const { data: minutes, isLoading, error } = useMeetings(user?.id || "");

  const [currentMinutes, setCurrentMinutes] = useState<MeetingMinutes>({
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

  // Atualiza a variável global quando systemAudioEnabled muda
  useEffect(() => {
    window.systemAudioEnabled = systemAudioEnabled;
  }, [systemAudioEnabled]);

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
    minutes: currentMinutes,
    onMinutesUpdate: setCurrentMinutes,
    beforeTranscriptionStart: checkTranscriptionLimit,
    systemAudioEnabled
  });

  // Filter minutes based on search and type
  const filteredMinutes = minutes?.filter(minute => {
    const matchesSearch = minute.meetingTitle.toLowerCase().includes(meetingSearch.toLowerCase()) ||
                         minute.summary?.toLowerCase().includes(meetingSearch.toLowerCase());
    const matchesType = meetingType === 'all' || minute.meetingType === meetingType;
    return matchesSearch && matchesType;
  }) || [];

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
        minutes: currentMinutes,
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

              <div className="w-full mt-8">
                <Tabs defaultValue="recording" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recording">Gravações</TabsTrigger>
                    <TabsTrigger value="minutes">Atas</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="recording" className="mt-4">
                    <RecordingHistorySection
                      recordingDateRange={recordingDateRange}
                      setRecordingDateRange={setRecordingDateRange}
                    />
                  </TabsContent>
                  
                  <TabsContent value="minutes" className="mt-4">
                    <MeetingHistorySection
                      meetingSearch={meetingSearch}
                      setMeetingSearch={setMeetingSearch}
                      meetingType={meetingType}
                      setMeetingType={setMeetingType}
                      filteredMinutes={filteredMinutes}
                      isLoading={isLoading}
                      error={error}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecordingContainer;