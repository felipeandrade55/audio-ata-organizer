import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { processTranscriptionResult, updateMinutesFromTranscription } from "@/services/transcriptionService";
import { transcribeWithGoogleCloud } from "@/services/googleTranscriptionService";
import { TranscriptionSegment } from "@/types/transcription";
import { findTriggers, updateMinutesWithTriggers } from "@/services/triggerService";
import { MeetingMinutes } from "@/types/meeting";
import { supabase } from "@/lib/supabase";

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
  
  const saveTranscriptionToHistory = async (audioBlob: Blob, transcriptionText: string, meetingId?: string) => {
    try {
      // Primeiro, salvamos o arquivo de áudio no bucket do Supabase
      const audioFileName = `recording-${Date.now()}.wav`;
      const { data: audioData, error: audioError } = await supabase.storage
        .from('meeting_recordings')
        .upload(audioFileName, audioBlob);

      if (audioError) {
        console.error('Erro ao salvar arquivo de áudio:', audioError);
        throw audioError;
      }

      // Agora salvamos o registro na tabela transcription_history
      const { data: transcriptionData, error: transcriptionError } = await supabase
        .from('transcription_history')
        .insert([
          {
            meeting_id: meetingId,
            audio_path: audioFileName,
            transcription_text: transcriptionText,
            status: 'completed',
            processed_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (transcriptionError) {
        console.error('Erro ao salvar transcrição:', transcriptionError);
        throw transcriptionError;
      }

      console.log('Transcrição salva com sucesso:', transcriptionData);
      return transcriptionData;
    } catch (error) {
      console.error('Erro ao salvar transcrição:', error);
      throw error;
    }
  };

  const handleTranscription = useCallback(async (audioBlob: Blob) => {
    console.log('Iniciando transcrição do áudio');
    console.log('Serviço de transcrição:', transcriptionService);
    
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
      console.log(`Usando chave ${transcriptionService} com comprimento:`, cleanApiKey.length);

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
        
        // Salvar a transcrição no histórico
        const transcriptionText = segments.map(s => `${s.speaker}: ${s.text}`).join('\n');
        await saveTranscriptionToHistory(audioBlob, transcriptionText, minutes?.id);
        
        if (minutes && onMinutesUpdate) {
          const updatedMinutes = await updateMinutesFromTranscription(minutes, segments);
          const minutesWithTriggers = updateMinutesWithTriggers(updatedMinutes, 
            segments.flatMap(s => findTriggers(s.text))
          );
          
          onMinutesUpdate(minutesWithTriggers);
          console.log('Ata atualizada com sucesso');
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