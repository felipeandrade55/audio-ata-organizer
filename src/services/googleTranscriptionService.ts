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

    const requestBody = {
      config: {
        encoding: audioBlob.type.includes('webm') ? 'WEBM_OPUS' : 'LINEAR16',
        sampleRateHertz: 48000,
        audioChannelCount: 2,
        languageCode: 'pt-BR',
        enableWordTimeOffsets: true,
        enableAutomaticPunctuation: true,
        enableSpeakerDiarization: true,
        diarizationSpeakerCount: 2,
        model: 'default'
      },
      audio: {
        content: audioBytes
      }
    };

    console.log("Configuração da requisição:", JSON.stringify(requestBody.config, null, 2));

    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na API do Google Cloud:', errorText);
      throw new Error(`Erro na API do Google Cloud: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();
    console.log("Resposta da API do Google Cloud:", JSON.stringify(responseData, null, 2));

    const segments: TranscriptionSegment[] = [];

    if (responseData.results) {
      responseData.results.forEach((result: any, resultIndex: number) => {
        if (!result.alternatives?.[0]) return;

        const words = result.alternatives[0].words || [];
        let currentText = '';
        let lastTimestamp = '';
        let lastSpeaker = '';
        let segmentStart = 0;
        let segmentEnd = 0;

        words.forEach((word: any, index: number) => {
          const startTime = parseFloat(word.startTime?.replace('s', '') || '0');
          const endTime = parseFloat(word.endTime?.replace('s', '') || '0');
          const minutes = Math.floor(startTime / 60);
          const seconds = Math.floor(startTime % 60);
          const timestamp = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          
          const speaker = word.speakerTag ? `Speaker ${word.speakerTag}` : 'Speaker 1';

          if ((timestamp !== lastTimestamp && currentText) || (speaker !== lastSpeaker && lastSpeaker)) {
            if (currentText) {
              segments.push({
                timestamp: lastTimestamp || timestamp,
                speaker: lastSpeaker || speaker,
                text: currentText.trim(),
                start: segmentStart,
                end: segmentEnd,
              });
            }
            currentText = word.word;
            segmentStart = startTime;
          } else {
            currentText += ' ' + word.word;
          }

          lastTimestamp = timestamp;
          lastSpeaker = speaker;
          segmentEnd = endTime;

          if (index === words.length - 1 && currentText) {
            segments.push({
              timestamp: lastTimestamp,
              speaker: lastSpeaker,
              text: currentText.trim(),
              start: segmentStart,
              end: segmentEnd,
            });
          }
        });

        if (!words.length && result.alternatives[0].transcript) {
          segments.push({
            timestamp: '00:00',
            speaker: 'Speaker 1',
            text: result.alternatives[0].transcript.trim(),
            start: 0,
            end: 0,
          });
        }
      });
    }

    console.log("Segmentos processados do Google Cloud:", segments);
    return segments;
  } catch (error) {
    console.error('Erro na transcrição com Google Cloud:', error);
    throw error;
  }
};