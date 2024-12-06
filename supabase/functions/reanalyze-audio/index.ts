import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { processAudioFile } from './audioProcessing.ts';
import { analyzeTranscription } from './aiAnalysis.ts';
import { updateDatabase } from './databaseOperations.ts';
import { retry } from './retryUtils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { meetingId, audioPath } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Starting reanalysis for meeting:', meetingId, 'with audio:', audioPath);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create new transcription history entry
    const { data: transcription, error: transcriptionError } = await supabaseClient
      .from('transcription_history')
      .insert({
        meeting_id: meetingId,
        audio_path: audioPath,
        status: 'processing'
      })
      .select()
      .single();

    if (transcriptionError) {
      throw new Error(`Error creating transcription: ${transcriptionError.message}`);
    }

    // Process audio with retries
    const { transcriptionText } = await retry(
      () => processAudioFile(supabaseClient, audioPath, openAIApiKey),
      3,
      1000
    );

    // Analyze transcription with retries
    const analysis = await retry(
      () => analyzeTranscription(transcriptionText, openAIApiKey),
      3,
      1000
    );

    // Update database
    const updateResult = await updateDatabase(
      supabaseClient,
      meetingId,
      analysis,
      transcription.id
    );

    if (!updateResult.success) {
      throw new Error(`Database update failed: ${updateResult.error}`);
    }

    return new Response(
      JSON.stringify({ 
        message: 'Audio reanalyzed successfully',
        summary: analysis.summary
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in reanalyze-audio function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});