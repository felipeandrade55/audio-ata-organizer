import { supabase } from "@/lib/supabase";
import { TranscriptionSegment } from "@/types/transcription";
import { MeetingMinutes } from "@/types/meeting";

interface AIAnalysisResult {
  sentiment: {
    type: string;
    confidence: number;
    context: string;
  }[];
  summary: {
    topics: string[];
    keyPoints: string[];
    mainDecisions: string[];
  };
  actions: {
    task: string;
    responsible: string;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  participation: {
    speaker: string;
    timeSpoken: number;
    interventions: number;
  }[];
  legalContext: {
    terms: string[];
    implications: string[];
    references: string[];
  };
  suggestions: {
    relatedDocuments: string[];
    nextSteps: string[];
    participants: string[];
  };
}

export const analyzeTranscriptionWithAI = async (
  segments: TranscriptionSegment[],
  minutes: MeetingMinutes
): Promise<AIAnalysisResult | null> => {
  try {
    const { data: analysisResult, error } = await supabase.functions.invoke('analyze-transcription-ai', {
      body: {
        segments,
        meetingContext: {
          title: minutes.meetingTitle,
          type: minutes.meetingType,
          participants: minutes.participants
        }
      }
    });

    if (error) throw error;
    return analysisResult;
  } catch (error) {
    console.error('Error in AI analysis:', error);
    return null;
  }
};