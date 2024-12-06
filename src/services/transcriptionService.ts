import { TranscriptionSegment } from "@/types/transcription";
import { analyzeEmotions } from "./emotionDetectionService";
import { supabase } from "@/lib/supabase";

export const processTranscriptionResult = async (
  result: any,
  audioBlob: Blob,
  apiKey?: string
): Promise<TranscriptionSegment[]> => {
  console.log('Processando resultado da transcrição:', result);
  
  if (!apiKey) {
    throw new Error('API key não configurada. Por favor, configure sua chave API nas configurações.');
  }

  // Validate API key format
  if (typeof apiKey !== 'string' || !apiKey.startsWith('sk-')) {
    throw new Error('Chave API inválida. Por favor, verifique suas configurações.');
  }

  const segments = result.segments.map((segment: any) => {
    const audioFeatures = new Float32Array(segment.tokens.length);
    const timestamp = segment.start * 1000;
    
    return {
      id: `${timestamp}`,
      start: segment.start,
      end: segment.end,
      text: segment.text,
      words: segment.tokens.map((token: any, index: number) => ({
        text: token.text,
        start: token.start,
        end: token.end,
        confidence: token.confidence,
        audioFeature: audioFeatures[index]
      })),
      confidence: segment.confidence,
      audioFeatures: Array.from(audioFeatures),
      speaker: segment.speaker
    };
  });

  try {
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
  } catch (error: any) {
    console.error('Erro na análise de emoções:', error);
    if (error.status === 401) {
      throw new Error('Chave API inválida ou expirada. Por favor, verifique suas configurações.');
    }
    // Return segments without emotions if emotion analysis fails
    return segments;
  }
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
    const uniqueParticipants = Array.from(uniqueSpeakers).map(name => ({
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
        participants: [...uniqueParticipants, ...aiAnalysis.participants.filter(p => 
          !uniqueParticipants.some(existing => existing.name === p.name)
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

    // Se houver falha na análise da IA, retorna a atualização básica
    const basicUpdate: MeetingMinutes = {
      ...minutes,
      participants: [...minutes.participants, ...uniqueParticipants.filter(p => 
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
  } catch (error) {
    console.error('Erro ao processar análise da IA:', error);
    throw error;
  }
};