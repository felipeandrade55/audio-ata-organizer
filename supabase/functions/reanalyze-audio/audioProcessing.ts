import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

interface AudioProcessingResult {
  transcriptionText: string;
  audioPath: string;
}

export async function processAudioFile(
  supabaseClient: any,
  audioPath: string,
  openAIApiKey: string
): Promise<AudioProcessingResult> {
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
  return {
    transcriptionText: transcriptionResult.text,
    audioPath
  };
}