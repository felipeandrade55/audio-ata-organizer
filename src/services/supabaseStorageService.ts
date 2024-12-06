import { supabase } from "@/lib/supabase";
import { retry } from "@/utils/retryUtils";

export const saveAudioToStorage = async (audioBlob: Blob, fileName: string) => {
  const maxRetries = 3;
  
  try {
    const { data, error } = await retry(
      async () => {
        const result = await supabase.storage
          .from('meeting_recordings')
          .upload(fileName, audioBlob);
        
        if (result.error) throw result.error;
        return result;
      },
      maxRetries,
      1000
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao salvar áudio:', error);
    throw new Error('Falha ao salvar o arquivo de áudio. Por favor, tente novamente.');
  }
};

export const saveTranscriptionRecord = async (
  meetingId: string | undefined,
  audioPath: string,
  transcriptionText: string
) => {
  const maxRetries = 3;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Usuário não autenticado');

    const { data, error } = await retry(
      async () => {
        const result = await supabase
          .from('transcription_history')
          .insert([
            {
              meeting_id: meetingId,
              audio_path: audioPath,
              transcription_text: transcriptionText,
              status: 'completed',
              processed_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (result.error) throw result.error;
        return result;
      },
      maxRetries,
      1000
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao salvar transcrição:', error);
    throw new Error('Falha ao salvar o registro da transcrição. Por favor, tente novamente.');
  }
};