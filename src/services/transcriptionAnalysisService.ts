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
  minutes: MeetingMinutes,
  audioPath?: string
): Promise<AnalysisResult | null> => {
  try {
    console.log('Starting transcription analysis with audio path:', audioPath);
    
    // Format transcription text with timestamps and speakers
    const transcriptionText = segments
      .map(s => `[${s.timestamp}] ${s.speaker}: ${s.text}`)
      .join('\n');
    
    console.log('Formatted transcription text:', transcriptionText);

    if (!audioPath) {
      console.error('No audio path provided for transcription analysis');
      throw new Error('Audio path is required for transcription analysis');
    }

    // Save transcription to history with audio path
    const { data: transcriptionRecord, error: saveError } = await supabase
      .from('transcription_history')
      .insert({
        meeting_id: minutes.id,
        transcription_text: transcriptionText,
        status: 'processing',
        audio_path: audioPath
      })
      .select()
      .single();

    if (saveError || !transcriptionRecord) {
      console.error('Error saving transcription:', saveError);
      return null;
    }

    // Call edge function to analyze transcription
    const { data: analysisData, error: analysisError } = await supabase.functions
      .invoke('analyze-transcription', {
        body: {
          transcriptionId: transcriptionRecord.id,
          transcriptionText,
          meetingContext: {
            title: minutes.meetingTitle,
            date: minutes.date,
            participants: minutes.participants,
          }
        }
      });

    if (analysisError) {
      console.error('Error calling analyze-transcription function:', analysisError);
      throw analysisError;
    }

    console.log('Analysis result:', analysisData);

    return analysisData;
  } catch (error) {
    console.error('Error in transcription analysis:', error);
    return null;
  }
};