import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { processTranscriptionResult, updateMinutesFromTranscription } from "@/services/transcriptionService";
import { transcribeWithGoogleCloud } from "@/services/googleTranscriptionService";
import { TranscriptionSegment } from "@/types/transcription";
import { findTriggers, updateMinutesWithTriggers } from "@/services/triggerService";
import { MeetingMinutes } from "@/types/meeting";
import { supabase } from "@/lib/supabase";
import { saveAudioToStorage, saveTranscriptionRecord } from "@/services/supabaseStorageService";

interface TranscriptionHandlerProps {
  apiKey: string;
  transcriptionService: 'openai' | 'google';
  setIsTranscribing: (value: boolean) => void;
  setTranscriptionSegments: (segments: TranscriptionSegment[]) => void;
  recordingStartTime: number | null;
  minutes?: MeetingMinutes;
  onMinutesUpdate?: (minutes: MeetingMinutes) => void;
}

export const useTranscriptionHandler = ({
  apiKey,
  transcriptionService,
  setIsTranscribing,
  setTranscriptionSegments,
  recordingStartTime,
  minutes,
  onMinutesUpdate,
}: TranscriptionHandlerProps) => {
  const { toast } = useToast();

  const createOrUpdateMeetingMinutes = async (minutes: MeetingMinutes) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Usuário não autenticado');
      }

      // Preparar os dados para inserção/atualização no banco
      const meetingData = {
        user_id: session.user.id,
        date: minutes.date,
        start_time: minutes.startTime,
        end_time: minutes.endTime || null,
        location: minutes.location || 'Virtual - Gravação de Áudio',
        meeting_title: minutes.meetingTitle,
        organizer: minutes.organizer || null,
        summary: minutes.summary || null,
        author: minutes.author || 'Sistema de Transcrição',
        approver: minutes.approver || null,
        meeting_type: minutes.meetingType || 'initial',
        confidentiality_level: minutes.confidentialityLevel || 'internal',
        version: minutes.version || 1,
        status: minutes.status || 'draft',
        last_modified: new Date().toISOString()
      };

      console.log('Dados preparados para salvar:', meetingData);

      const { data, error } = await supabase
        .from('meeting_minutes')
        .upsert([meetingData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar ata:', error);
        throw error;
      }

      console.log('Ata salva com sucesso:', data);

      // Se houver participantes, salvá-los separadamente
      if (minutes.participants && minutes.participants.length > 0) {
        const participantsData = minutes.participants.map(participant => ({
          meeting_id: data.id,
          name: participant.name,
          role: participant.role || null,
          oab: participant.oab || null,
          email: participant.email || null,
          phone: participant.phone || null
        }));

        const { error: participantsError } = await supabase
          .from('meeting_participants')
          .upsert(participantsData);

        if (participantsError) {
          console.error('Erro ao salvar participantes:', participantsError);
        }
      }

      // Se houver itens de agenda, salvá-los separadamente
      if (minutes.agendaItems && minutes.agendaItems.length > 0) {
        const agendaItemsData = minutes.agendaItems.map((item, index) => ({
          meeting_id: data.id,
          title: item.title,
          discussion: item.discussion || null,
          responsible: item.responsible || null,
          decision: item.decision || null,
          confidential: item.confidential || false,
          order_index: index
        }));

        const { error: agendaError } = await supabase
          .from('agenda_items')
          .upsert(agendaItemsData);

        if (agendaError) {
          console.error('Erro ao salvar itens da agenda:', agendaError);
        }
      }

      // Se houver itens de ação, salvá-los separadamente
      if (minutes.actionItems && minutes.actionItems.length > 0) {
        const actionItemsData = minutes.actionItems.map(item => ({
          meeting_id: data.id,
          task: item.task,
          responsible: item.responsible || null,
          deadline: item.deadline || null,
          priority: item.priority || null,
          status: item.status || 'pending',
          legal_deadline: item.legalDeadline || false
        }));

        const { error: actionError } = await supabase
          .from('action_items')
          .upsert(actionItemsData);

        if (actionError) {
          console.error('Erro ao salvar itens de ação:', actionError);
        }
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar/atualizar ata:', error);
      throw error;
    }
  };

  const handleTranscription = useCallback(async (audioBlob: Blob) => {
    console.log('Iniciando transcrição do áudio');
    setIsTranscribing(true);

    try {
      if (!apiKey || 
          apiKey.trim() === '' || 
          apiKey === 'your_openai_api_key_here' || 
          apiKey === 'your_google_api_key_here' || 
          apiKey.includes('*')) {
        throw new Error(`Por favor, configure uma chave válida da API ${transcriptionService.toUpperCase()} no arquivo .env antes de tentar transcrever.`);
      }

      const cleanApiKey = apiKey.trim();
      let segments: TranscriptionSegment[];

      if (transcriptionService === 'google') {
        segments = await transcribeWithGoogleCloud(audioBlob, cleanApiKey);
      } else {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.wav');
        formData.append('model', 'whisper-1');
        formData.append('language', 'pt');
        formData.append('response_format', 'verbose_json');

        console.log('Enviando requisição para OpenAI...');
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cleanApiKey}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Erro na resposta da OpenAI:', errorData);
          
          if (response.status === 401) {
            throw new Error('Chave da API OpenAI inválida. Por favor, verifique se você configurou uma chave válida no arquivo .env');
          }
          
          throw new Error(`Erro na API OpenAI: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
        }

        const responseData = await response.json();
        console.log('Resposta da OpenAI:', responseData);
        segments = await processTranscriptionResult(responseData, audioBlob, cleanApiKey);
      }

      if (segments.length > 0) {
        console.log('Processando segmentos da transcrição:', segments);
        
        let meetingMinutes = minutes;
        if (!meetingMinutes) {
          meetingMinutes = {
            id: crypto.randomUUID(),
            date: new Date().toLocaleDateString('pt-BR'),
            startTime: new Date().toLocaleTimeString('pt-BR'),
            endTime: '',
            location: 'Virtual - Gravação de Áudio',
            meetingTitle: 'Nova Reunião',
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
          };
        }

        const savedMinutes = await createOrUpdateMeetingMinutes(meetingMinutes);
        console.log('Ata salva/atualizada:', savedMinutes);
        
        const audioFileName = `recording-${Date.now()}.wav`;
        await saveAudioToStorage(audioBlob, audioFileName);
        
        const transcriptionText = segments.map(s => `${s.speaker}: ${s.text}`).join('\n');
        await saveTranscriptionRecord(savedMinutes.id, audioFileName, transcriptionText);
        
        if (onMinutesUpdate && meetingMinutes) {
          const updatedMinutes = await updateMinutesFromTranscription(meetingMinutes, segments);
          const minutesWithTriggers = updateMinutesWithTriggers(updatedMinutes, 
            segments.flatMap(s => findTriggers(s.text))
          );
          
          onMinutesUpdate(minutesWithTriggers);
        }
      }
      
      setTranscriptionSegments(segments);

      toast({
        title: "Transcrição concluída",
        description: "A transcrição foi processada e salva com sucesso.",
      });
    } catch (error) {
      console.error('Erro na transcrição:', error);
      
      let errorMessage = "Não foi possível transcrever o áudio.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro na transcrição",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  }, [apiKey, transcriptionService, setIsTranscribing, setTranscriptionSegments, toast, minutes, onMinutesUpdate]);

  return { handleTranscription };
};