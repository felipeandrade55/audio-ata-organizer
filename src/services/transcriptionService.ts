import { TranscriptionSegment } from "@/types/transcription";
import { voiceIdentificationService } from "./voiceIdentificationService";
import { handleNameRecognition } from "./nameRecognitionService";
import { analyzeEmotions } from "./emotionDetectionService";
import { MeetingMinutes } from "@/types/meeting";
import { analyzeTranscription } from "./aiAnalysisService";

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

export const updateMinutesFromTranscription = async (
  minutes: MeetingMinutes,
  segments: TranscriptionSegment[]
): Promise<MeetingMinutes> => {
  console.log('Atualizando ata com segmentos:', segments);

  try {
    // Concatenar todo o texto dos segmentos
    const fullTranscription = segments.map(s => s.text).join(' ');
    
    // Identificar participantes únicos
    const uniqueSpeakers = new Set(segments.map(s => s.speaker));
    const participants = Array.from(uniqueSpeakers).map(name => ({
      name,
      role: ''
    }));

    // Analisar a transcrição completa com a IA
    const aiAnalysis = await analyzeTranscription(fullTranscription, minutes.apiKey || '');

    if (aiAnalysis) {
      // Mesclar a análise da IA com os dados existentes
      const updatedMinutes: MeetingMinutes = {
        ...minutes,
        meetingTitle: aiAnalysis.meetingTitle || minutes.meetingTitle,
        participants: [...participants, ...aiAnalysis.participants.filter(p => 
          !participants.some(existing => existing.name === p.name)
        )],
        agendaItems: [
          ...minutes.agendaItems,
          ...aiAnalysis.agendaItems.filter(item => 
            !minutes.agendaItems.some(existing => existing.title === item.title)
          )
        ],
        actionItems: [
          ...minutes.actionItems,
          ...aiAnalysis.actionItems.filter(item =>
            !minutes.actionItems.some(existing => existing.task === item.task)
          )
        ],
        summary: aiAnalysis.summary || minutes.summary,
        nextSteps: [
          ...new Set([...minutes.nextSteps, ...aiAnalysis.nextSteps])
        ],
        lastModified: new Date().toISOString()
      };

      console.log('Ata atualizada com análise da IA:', updatedMinutes);
      return updatedMinutes;
    }
  } catch (error) {
    console.error('Erro ao processar análise da IA:', error);
  }

  // Se houver falha na análise da IA, retorna a atualização básica
  const basicUpdate: MeetingMinutes = {
    ...minutes,
    participants: [...minutes.participants, ...participants.filter(p => 
      !minutes.participants.some(existing => existing.name === p.name)
    )],
    agendaItems: [
      ...minutes.agendaItems,
      {
        title: 'Discussão',
        discussion: segments.map(s => s.text).join(' '),
        responsible: '',
        decision: ''
      }
    ],
    lastModified: new Date().toISOString()
  };

  console.log('Ata atualizada (versão básica):', basicUpdate);
  return basicUpdate;
};