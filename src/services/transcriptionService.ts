import { TranscriptionSegment } from "@/types/transcription";
import { findCalendarIntents } from "./calendarIntentService";
import { supabase } from "@/lib/supabase";
import { MeetingMinutes } from "@/types/meeting";

export const processTranscriptionResult = async (
  responseData: any,
  audioBlob: Blob,
  apiKey: string
): Promise<TranscriptionSegment[]> => {
  console.log("Processando resultado da transcrição...");
  
  const segments: TranscriptionSegment[] = [];
  
  // Processamento dos segmentos
  if (responseData && responseData.segments) {
    for (const segment of responseData.segments) {
      segments.push({
        speaker: segment.speaker,
        text: segment.text,
        start: segment.start,
        end: segment.end,
      });
    }
  }

  // Processa intenções de calendário
  const transcriptionText = segments.map(s => s.text).join(" ");
  const calendarIntents = findCalendarIntents(transcriptionText);
  
  if (calendarIntents.length > 0) {
    console.log("Intenções de calendário encontradas:", calendarIntents);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        for (const intent of calendarIntents) {
          const { error } = await supabase
            .from('calendar_events')
            .insert({
              user_id: session.user.id,
              title: intent.title,
              description: intent.description,
              start_time: intent.startTime,
              end_time: intent.endTime,
              event_type: intent.type,
              status: 'pending'
            });
            
          if (error) {
            console.error('Erro ao salvar evento:', error);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar eventos do calendário:', error);
    }
  }
  
  return segments;
};

export const updateMinutesFromTranscription = async (
  minutes: MeetingMinutes,
  segments: TranscriptionSegment[]
): Promise<MeetingMinutes> => {
  const transcriptionText = segments.map(s => s.text).join(" ");
  const calendarIntents = findCalendarIntents(transcriptionText);
  
  // Atualiza a ata com os eventos encontrados
  const updatedMinutes = { ...minutes };
  
  if (calendarIntents.length > 0) {
    updatedMinutes.nextSteps = [
      ...updatedMinutes.nextSteps,
      ...calendarIntents.map(intent => 
        `${intent.type.toUpperCase()}: ${intent.title} - ${intent.startTime}`
      )
    ];
  }
  
  return updatedMinutes;
};
