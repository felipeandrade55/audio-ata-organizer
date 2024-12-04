import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { processTranscriptionResult } from "@/services/transcriptionService";
import { TranscriptionSegment } from "@/types/transcription";
import { findTriggers, updateMinutesWithTriggers } from "@/services/triggerService";
import { MeetingMinutes } from "@/types/meeting";

interface TranscriptionHandlerProps {
  apiKey: string;
  setIsTranscribing: (value: boolean) => void;
  setTranscriptionSegments: (segments: TranscriptionSegment[]) => void;
  recordingStartTime: number | null;
  minutes?: MeetingMinutes;
  onMinutesUpdate?: (minutes: MeetingMinutes) => void;
}

export const useTranscriptionHandler = ({
  apiKey,
  setIsTranscribing,
  setTranscriptionSegments,
  recordingStartTime,
  minutes,
  onMinutesUpdate,
}: TranscriptionHandlerProps) => {
  const { toast } = useToast();

  const handleTranscription = useCallback(async (audioBlob: Blob) => {
    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-1');
      formData.append('language', 'pt');
      formData.append('response_format', 'verbose_json');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Falha na transcrição');
      }

      const result = await response.json();
      const segments = await processTranscriptionResult(result, audioBlob, apiKey);
      
      // Processa triggers no último segmento
      if (segments.length > 0) {
        const lastSegment = segments[segments.length - 1];
        const triggers = findTriggers(lastSegment.text);
        
        if (triggers.length > 0) {
          lastSegment.triggers = triggers;
          
          if (minutes && onMinutesUpdate) {
            const updatedMinutes = updateMinutesWithTriggers(minutes, triggers);
            onMinutesUpdate(updatedMinutes);
            
            toast({
              title: "Ação detectada",
              description: "A ata foi atualizada com base nas palavras-chave identificadas.",
            });
          }
        }
      }
      
      setTranscriptionSegments(segments);

      toast({
        title: "Transcrição concluída",
        description: "A ata da reunião está pronta.",
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
  }, [apiKey, setIsTranscribing, setTranscriptionSegments, toast, minutes, onMinutesUpdate]);

  return { handleTranscription };
};