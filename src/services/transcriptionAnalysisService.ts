import { supabase } from "@/lib/supabase";
import { TranscriptionSegment } from "@/types/transcription";
import { MeetingMinutes } from "@/types/meeting";

interface AnalysisResult {
  summary: string;
  sentimentAnalysis: Array<{
    speaker: string;
    sentiment: string;
    confidence: number;
    context: string;
  }>;
  keyMoments: Array<{
    timestamp: string;
    description: string;
    importance: 'high' | 'medium' | 'low';
  }>;
  concerns: string[];
  engagementTopics: Array<{
    topic: string;
    engagement: number;
  }>;
}

export const analyzeTranscription = async (
  segments: TranscriptionSegment[],
  minutes: MeetingMinutes
): Promise<AnalysisResult | null> => {
  try {
    const transcriptionText = segments.map(s => `${s.speaker}: ${s.text}`).join('\n');
    
    // Save transcription to history
    const { data: transcriptionRecord, error: saveError } = await supabase
      .from('transcription_history')
      .insert({
        meeting_id: minutes.id,
        transcription_text: transcriptionText,
        status: 'processing'
      })
      .select()
      .single();

    if (saveError || !transcriptionRecord) {
      console.error('Error saving transcription:', saveError);
      return null;
    }

    // Call edge function to analyze transcription
    const response = await fetch('/api/analyze-transcription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcriptionId: transcriptionRecord.id,
        transcriptionText
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze transcription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in transcription analysis:', error);
    return null;
  }
};