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
    const { transcriptionId, transcriptionText, meetingContext } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    console.log('Analyzing transcription:', { transcriptionId, meetingContext });
    console.log('Transcription text sample:', transcriptionText.substring(0, 200) + '...');

    // Analyze transcription with OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            1. Um resumo detalhado e estruturado da reunião, focando nos principais pontos discutidos
            2. Análise de sentimentos dos participantes durante a discussão
            3. Momentos-chave e decisões importantes, com seus respectivos timestamps
            4. Pontos de atenção ou preocupações levantadas
            5. Tópicos que geraram mais engajamento ou discussão
            
            Retorne apenas um objeto JSON com as seguintes chaves:
            {
              "summary": "resumo detalhado",
              "sentimentAnalysis": [{"speaker": "nome", "sentiment": "positivo/neutro/negativo", "confidence": 0.9, "context": "trecho"}],
              "keyMoments": [{"timestamp": "HH:MM:SS", "description": "descrição", "importance": "high/medium/low"}],
              "concerns": ["preocupação 1", "preocupação 2"],
              "engagementTopics": [{"topic": "tópico", "engagement": 0.9}]
            }`
          },
          {
            role: 'user',
            content: transcriptionText
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error response:', errorData);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);
    
    let analysis;
    try {
      // Garantir que a resposta é um JSON válido
      const content = data.choices[0].message.content.trim();
      analysis = JSON.parse(content);
      console.log('Parsed analysis:', analysis);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse OpenAI response');
    }

    // Update transcription record with analysis
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: updateError } = await supabaseClient
      .from('transcription_history')
      .update({
        sentiment_analysis: analysis.sentimentAnalysis,
        key_moments: analysis.keyMoments,
        processed_at: new Date().toISOString(),
        status: 'completed'
      })
      .eq('id', transcriptionId);

    if (updateError) {
      console.error('Error updating transcription:', updateError);
      throw updateError;
    }

    // Update meeting minutes with summary
    const { data: transcription } = await supabaseClient
      .from('transcription_history')
      .select('meeting_id')
      .eq('id', transcriptionId)
      .single();

    if (transcription?.meeting_id) {
      const { error: minutesError } = await supabaseClient
        .from('meeting_minutes')
        .update({
          summary: analysis.summary,
          last_modified: new Date().toISOString()
        })
        .eq('id', transcription.meeting_id);

      if (minutesError) {
        console.error('Error updating meeting minutes:', minutesError);
        throw minutesError;
      }
    }

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in analyze-transcription function:', error);
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