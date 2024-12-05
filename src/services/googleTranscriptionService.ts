import { TranscriptionSegment } from "@/types/transcription";

export const transcribeWithGoogleCloud = async (
  audioBlob: Blob,
  apiKey: string
): Promise<TranscriptionSegment[]> => {
  try {
    // Convert blob to base64
    const audioBytes = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = (reader.result as string).split(',')[1];
        resolve(base64Audio);
      };
      reader.readAsDataURL(audioBlob);
    });

    console.log("Enviando áudio para transcrição (Google Cloud)...");

    // Configure request for Google Cloud Speech-to-Text
    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          audioChannelCount: 2,
          languageCode: 'pt-BR',
          enableWordTimeOffsets: true,
          enableAutomaticPunctuation: true,
          model: 'default',
        },
        audio: {
          content: audioBytes,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Cloud API Error:', errorData);
      throw new Error(errorData.error?.message || 'Falha na transcrição com Google Cloud');
    }

    const result = await response.json();
    console.log("Resultado da transcrição (Google Cloud):", result);
    
    // Process the result and convert to our system's format
    const segments: TranscriptionSegment[] = [];
    let currentSegment: TranscriptionSegment = {
      timestamp: '00:00',
      speaker: 'Speaker 1',
      text: '',
    };

    if (result.results && result.results.length > 0) {
      result.results.forEach((result: any) => {
        const alternatives = result.alternatives[0];
        if (alternatives && alternatives.words) {
          alternatives.words.forEach((word: any) => {
            const startTime = parseFloat(word.startTime.seconds || 0);
            const minutes = Math.floor(startTime / 60);
            const seconds = Math.floor(startTime % 60);
            const timestamp = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timestamp !== currentSegment.timestamp && currentSegment.text) {
              segments.push({ ...currentSegment });
              currentSegment = {
                timestamp,
                speaker: 'Speaker 1',
                text: word.word,
              };
            } else {
              currentSegment.text += ' ' + word.word;
            }
          });
        } else if (alternatives && alternatives.transcript) {
          // Se não houver informações de palavras individuais, use a transcrição completa
          currentSegment.text = alternatives.transcript;
          segments.push({ ...currentSegment });
        }
      });

      if (currentSegment.text) {
        segments.push(currentSegment);
      }
    }

    return segments;
  } catch (error) {
    console.error('Erro na transcrição com Google Cloud:', error);
    throw error;
  }
};