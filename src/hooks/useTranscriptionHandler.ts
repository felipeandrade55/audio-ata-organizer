import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { processTranscriptionResult } from "@/services/transcriptionService";
import { TranscriptionSegment } from "@/types/transcription";
import { findKeywords, updateMinutesWithKeywords } from "@/services/keywordRecognitionService";
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
      const segments = await processTranscriptionResult(result, recordingStartTime || 0, apiKey);
      setTranscriptionSegments(segments);

      // Processa palavras-chave e atualiza a ata
      if (minutes && onMinutesUpdate && segments.length > 0) {
        const lastSegment = segments[segments.length - 1];
        if (lastSegment) {
          const keywords = findKeywords(lastSegment.text);
          if (keywords.length > 0) {
            const updatedMinutes = updateMinutesWithKeywords(minutes, keywords);
            onMinutesUpdate(updatedMinutes);
            
            toast({
              title: "Ata atualizada automaticamente",
              description: "Identificamos informações relevantes na fala.",
            });
          }
        }
      }

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
  }, [apiKey, setIsTranscribing, setTranscriptionSegments, toast, minutes, onMinutesUpdate, recordingStartTime]);

  return { handleTranscription };
};