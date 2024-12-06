import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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

    // Get meeting context
    const { data: meeting, error: meetingError } = await supabaseClient
      .from('meeting_minutes')
      .select('*')
      .eq('id', meetingId)
      .single();

    if (meetingError) {
      throw new Error(`Error fetching meeting: ${meetingError.message}`);
    }

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

    // Get the audio file URL
    const { data: audioData } = await supabaseClient.storage
      .from('meeting_recordings')
      .createSignedUrl(audioPath, 3600);

    if (!audioData?.signedUrl) {
      throw new Error('Could not generate signed URL for audio file');
    }

    // Download the audio file
    const audioResponse = await fetch(audioData.signedUrl);
    const audioBlob = await audioResponse.blob();

    // Process with OpenAI Whisper
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'pt');
    formData.append('response_format', 'verbose_json');

    console.log('Sending audio to OpenAI for transcription...');
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const transcriptionResult = await response.json();
    console.log('Received transcription from OpenAI');

    // Analyze with GPT-4
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em análise de transcrições de reuniões.
            Analise a transcrição fornecida e gere:
            1. Um resumo detalhado e estruturado da reunião
            2. Lista de participantes mencionados
            3. Principais pontos discutidos
            4. Ações e responsáveis
            5. Próximos passos definidos
            
            Formate a saída em JSON com as seguintes chaves:
            - summary: resumo detalhado
            - participants: array de objetos com nome e papel
            - agendaItems: array de objetos com título e discussão
            - actionItems: array de objetos com tarefa, responsável e prazo
            - nextSteps: array de strings`
          },
          {
            role: 'user',
            content: transcriptionResult.text
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`OpenAI Analysis API error: ${analysisResponse.statusText}`);
    }

    const analysisData = await analysisResponse.json();
    const analysis = JSON.parse(analysisData.choices[0].message.content);

    console.log('Analysis completed, updating meeting minutes...');

    // Update meeting minutes with new analysis
    const { error: updateError } = await supabaseClient
      .from('meeting_minutes')
      .update({
        summary: analysis.summary,
        last_modified: new Date().toISOString()
      })
      .eq('id', meetingId);

    if (updateError) {
      throw updateError;
    }

    // Update transcription history
    await supabaseClient
      .from('transcription_history')
      .update({
        transcription_text: transcriptionResult.text,
        status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('id', transcription.id);

    // Insert participants
    if (analysis.participants?.length > 0) {
      await supabaseClient
        .from('meeting_participants')
        .upsert(
          analysis.participants.map((p: any) => ({
            meeting_id: meetingId,
            name: p.name,
            role: p.role
          }))
        );
    }

    // Insert agenda items
    if (analysis.agendaItems?.length > 0) {
      await supabaseClient
        .from('agenda_items')
        .upsert(
          analysis.agendaItems.map((item: any, index: number) => ({
            meeting_id: meetingId,
            title: item.title,
            discussion: item.discussion,
            order_index: index
          }))
        );
    }

    // Insert action items
    if (analysis.actionItems?.length > 0) {
      await supabaseClient
        .from('action_items')
        .upsert(
          analysis.actionItems.map((item: any) => ({
            meeting_id: meetingId,
            task: item.task,
            responsible: item.responsible,
            deadline: item.deadline,
            status: 'pending'
          }))
        );
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