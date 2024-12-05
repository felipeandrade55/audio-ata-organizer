import { TranscriptionSegment } from "@/types/transcription";
import { voiceIdentificationService } from "./voiceIdentificationService";
import { handleNameRecognition } from "./nameRecognitionService";
import { analyzeEmotions } from "./emotionDetectionService";
import { MeetingMinutes } from "@/types/meeting";

export const processTranscriptionResult = async (
  result: any, 
  audioBlob: Blob, 
  apiKey: string
): Promise<TranscriptionSegment[]> => {
  console.log('Processando resultado da transcrição:', result);
  
  const segments = result.segments.map((segment: any) => {
    const audioFeatures = new Float32Array(segment.tokens.length);
    const timestamp = segment.start * 1000;
    
    const recognizedName = handleNameRecognition(segment.text);
    if (recognizedName) {
      console.log('Nome reconhecido no segmento:', recognizedName);
      voiceIdentificationService.addProfile(recognizedName, audioFeatures);
    }
    
    const speaker = voiceIdentificationService.identifyMostSimilarSpeaker(audioFeatures, timestamp);
    console.log('Falante identificado:', speaker);
    
    return {
      speaker,
      text: segment.text,
      timestamp: new Date(timestamp).toISOString().substr(11, 8)
    };
  });

  // Analisar emoções
  const emotions = await analyzeEmotions(audioBlob, apiKey);
  
  // Associar emoções aos segmentos correspondentes
  const processedSegments = segments.map(segment => {
    const emotion = emotions.find(e => e.text === segment.text);
    return {
      ...segment,
      emotion: emotion ? {
        type: emotion.emotion,
        confidence: emotion.confidence
      } : undefined
    };
  });

  console.log('Segmentos processados:', processedSegments);
  return processedSegments;
};

export const updateMinutesFromTranscription = (
  minutes: MeetingMinutes,
  segments: TranscriptionSegment[]
): MeetingMinutes => {
  console.log('Atualizando ata com segmentos:', segments);

  // Identificar participantes únicos
  const uniqueSpeakers = new Set(segments.map(s => s.speaker));
  const participants = Array.from(uniqueSpeakers).map(name => ({
    name,
    role: ''
  }));

  // Extrair discussões e decisões
  const discussions = segments.map(s => s.text).join(' ');
  
  // Atualizar a ata
  const updatedMinutes: MeetingMinutes = {
    ...minutes,
    participants: [...minutes.participants, ...participants.filter(p => 
      !minutes.participants.some(existing => existing.name === p.name)
    )],
    agendaItems: [
      ...minutes.agendaItems,
      {
        title: 'Discussão',
        discussion: discussions,
        responsible: '',
        decision: ''
      }
    ]
  };

  console.log('Ata atualizada:', updatedMinutes);
  return updatedMinutes;
};