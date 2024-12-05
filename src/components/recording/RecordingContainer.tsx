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
import { supabase } from "@/lib/supabase";

const RecordingContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [identificationEnabled, setIdentificationEnabled] = useState(false);
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

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log('Buscando chave API para o serviço:', transcriptionService);
        const { data, error } = await supabase
          .from('api_keys')
          .select('api_key')
          .eq('service', transcriptionService)
          .single();

        if (error) {
          console.error('Erro ao buscar chave API:', error);
          throw error;
        }

        if (!data?.api_key) {
          console.error('Nenhuma chave API encontrada para o serviço:', transcriptionService);
          throw new Error(`Nenhuma chave API encontrada para ${transcriptionService}`);
        }

        const cleanApiKey = data.api_key.trim();
        console.log(`Chave ${transcriptionService} encontrada com comprimento:`, cleanApiKey.length);
        setApiKey(cleanApiKey);
      } catch (error) {
        console.error('Erro ao buscar chave API:', error);
        toast({
          title: "Erro na Configuração",
          description: `Chave da API ${transcriptionService} não encontrada ou inválida. Por favor, verifique a configuração no Supabase.`,
          variant: "destructive",
        });
        setApiKey('');
      }
    };

    fetchApiKey();
  }, [transcriptionService, toast]);

  const checkTranscriptionLimit = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro de Autenticação",
          description: "Você precisa estar logado para gravar transcrições.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Verificando limite para usuário:', user.id);
      const { data, error } = await supabase.rpc('check_transcription_limit', {
        user_uuid: user.id
      });
      
      if (error) {
        console.error('Erro ao verificar limite:', error);
        throw error;
      }
      
      console.log('Resultado da verificação:', data);
      if (data && data[0].total_count >= 10) {
        const shouldProceed = window.confirm(
          "Você atingiu o limite de 10 transcrições na versão BETA. A transcrição mais antiga será removida para continuar. Deseja prosseguir?"
        );
        
        if (!shouldProceed) {
          return false;
        }

        // Delete the oldest transcription
        if (data[0].oldest_id) {
          const { error: deleteError } = await supabase
            .from('meeting_minutes')
            .delete()
            .eq('id', data[0].oldest_id);

          if (deleteError) throw deleteError;

          toast({
            title: "Transcrição antiga removida",
            description: "A transcrição mais antiga foi removida para liberar espaço.",
          });
        }
      }
      return true;
    } catch (error) {
      console.error('Erro ao verificar limite de transcrições:', error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar o limite de transcrições.",
        variant: "destructive",
      });
      return false;
    }
  };
  
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
    onMinutesUpdate: setMinutes,
    beforeTranscriptionStart: checkTranscriptionLimit
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
    // Check authentication first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para gravar transcrições.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "Erro de Configuração",
        description: `Por favor, configure a chave da API ${transcriptionService} no Supabase antes de iniciar a gravação.`,
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