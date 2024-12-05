import { TranscriptionSegment } from "@/types/transcription";

export const transcribeWithGoogleCloud = async (
  audioBlob: Blob,
  apiKey: string
): Promise<TranscriptionSegment[]> => {
  try {
    // Converter o blob para base64
    const audioBytes = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = (reader.result as string).split(',')[1];
        resolve(base64Audio);
      };
      reader.readAsDataURL(audioBlob);
    });

    // Configurar a requisição para o Google Cloud Speech-to-Text
    const response = await fetch('https://speech.googleapis.com/v1/speech:recognize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
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
      throw new Error('Falha na transcrição com Google Cloud');
    }

    const result = await response.json();
    
    // Processar o resultado e converter para o formato do nosso sistema
    const segments: TranscriptionSegment[] = [];
    let currentSegment: TranscriptionSegment = {
      timestamp: '00:00',
      speaker: 'Speaker 1',
      text: '',
    };

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
      }
    });

    if (currentSegment.text) {
      segments.push(currentSegment);
    }

    return segments;
  } catch (error) {
    console.error('Erro na transcrição com Google Cloud:', error);
    throw error;
  }
};