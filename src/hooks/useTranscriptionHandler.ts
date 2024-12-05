import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { processTranscriptionResult, updateMinutesFromTranscription } from "@/services/transcriptionService";
import { transcribeWithGoogleCloud } from "@/services/googleTranscriptionService";
import { TranscriptionSegment } from "@/types/transcription";
import { findTriggers, updateMinutesWithTriggers } from "@/services/triggerService";
import { MeetingMinutes } from "@/types/meeting";

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
  
  const handleTranscription = useCallback(async (audioBlob: Blob) => {
    console.log('Iniciando transcrição do áudio');
    setIsTranscribing(true);

    try {
      if (!apiKey || apiKey.trim() === '') {
        console.error(`Chave da API ${transcriptionService} não fornecida ou vazia`);
        throw new Error(`Chave da API ${transcriptionService} não fornecida`);
      }

      const cleanApiKey = apiKey.trim();
      console.log(`Usando chave ${transcriptionService} com comprimento:`, cleanApiKey.length);
      console.log('Primeiros caracteres da chave:', cleanApiKey.substring(0, 5));

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

        const responseText = await response.text();
        console.log('Resposta bruta da API:', responseText);

        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          console.error('Erro ao parsear resposta:', e);
          throw new Error('Erro ao processar resposta da API');
        }

        if (!response.ok) {
          console.error('Erro na resposta da API:', responseData);
          
          let errorMessage = 'Falha na transcrição';
          if (responseData.error?.message) {
            errorMessage = `Erro: ${responseData.error.message}`;
            if (responseData.error.code === 'invalid_api_key') {
              errorMessage = 'Chave API inválida. Por favor, verifique a configuração no Supabase.';
            }
          }
          
          throw new Error(errorMessage);
        }

        console.log('Resultado da transcrição:', responseData);
        segments = await processTranscriptionResult(responseData, audioBlob, cleanApiKey);
      }

      if (segments.length > 0) {
        console.log('Processando segmentos da transcrição');
        
        if (minutes && onMinutesUpdate) {
          const updatedMinutes = await updateMinutesFromTranscription(minutes, segments);
          const minutesWithTriggers = updateMinutesWithTriggers(updatedMinutes, 
            segments.flatMap(s => findTriggers(s.text))
          );
          
          onMinutesUpdate(minutesWithTriggers);
          console.log('Ata atualizada com sucesso');
          
          toast({
            title: "Ata atualizada",
            description: "A ata foi atualizada com o conteúdo da transcrição.",
          });
        }
      }
      
      setTranscriptionSegments(segments);

      toast({
        title: "Transcrição concluída",
        description: "A transcrição foi processada com sucesso.",
      });
    } catch (error) {
      console.error('Erro na transcrição:', error);
      toast({
        title: "Erro na transcrição",
        description: error instanceof Error ? error.message : "Não foi possível transcrever o áudio.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  }, [apiKey, transcriptionService, setIsTranscribing, setTranscriptionSegments, toast, minutes, onMinutesUpdate]);

  return { handleTranscription };
};