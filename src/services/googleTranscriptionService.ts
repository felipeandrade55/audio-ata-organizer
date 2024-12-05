import { TranscriptionSegment } from "@/types/transcription";

export const transcribeWithGoogleCloud = async (
  audioBlob: Blob,
  apiKey: string
): Promise<TranscriptionSegment[]> => {
  try {
    console.log("Verificando chave API do Google Cloud...");
    if (!apiKey || apiKey === 'YOUR_GOOGLE_API_KEY' || apiKey.includes('*')) {
      console.error('Chave API do Google Cloud inválida:', apiKey);
      throw new Error('Chave API do Google Cloud inválida ou não configurada. Por favor, configure uma chave válida no Supabase.');
    }

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
    console.log("Formato do áudio:", audioBlob.type);
    console.log("Comprimento da chave API:", apiKey?.length || 0);

    // Configure request for Google Cloud Speech-to-Text
    const requestBody = {
      config: {
        encoding: audioBlob.type.includes('webm') ? 'WEBM_OPUS' : 'LINEAR16',
        sampleRateHertz: 48000,
        audioChannelCount: 2,
        languageCode: 'pt-BR',
        enableWordTimeOffsets: true,
        enableAutomaticPunctuation: true,
        model: 'default',
      },
      audio: {
        content: audioBytes
      }
    };

    console.log("Configuração da requisição:", JSON.stringify(requestBody.config, null, 2));

    // Use API key as query parameter
    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log("Resposta da API do Google Cloud:", responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Erro ao processar resposta da API do Google Cloud:', e);
      throw new Error('Falha ao processar resposta da API do Google Cloud');
    }

    if (!response.ok) {
      console.error('Erro na API do Google Cloud:', responseData);
      
      const errorMessage = responseData.error?.message || 'Erro desconhecido';
      const errorDetails = responseData.error?.details?.[0]?.reason || '';
      
      throw new Error(
        `Erro na API do Google Cloud: ${errorMessage}${errorDetails ? ` (${errorDetails})` : ''}\n` +
        'Por favor, verifique se sua chave API do Google Cloud é válida e tem a API Speech-to-Text habilitada.'
      );
    }

    // Process the result and convert to our system's format
    const segments: TranscriptionSegment[] = [];
    let currentSegment: TranscriptionSegment = {
      timestamp: '00:00',
      speaker: 'Speaker 1',
      text: '',
    };

    if (responseData.results && responseData.results.length > 0) {
      responseData.results.forEach((result: any) => {
        const alternatives = result.alternatives[0];
        if (alternatives && alternatives.words) {
          alternatives.words.forEach((word: any) => {
            const startTime = parseFloat(word.startTime.replace('s', ''));
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