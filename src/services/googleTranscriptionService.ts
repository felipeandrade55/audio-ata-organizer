import { TranscriptionSegment } from "@/types/transcription";

export const transcribeWithGoogleCloud = async (
  audioBlob: Blob,
  apiKey: string
): Promise<TranscriptionSegment[]> => {
  try {
    if (!apiKey || apiKey === 'YOUR_GOOGLE_API_KEY' || apiKey.includes('*')) {
      throw new Error('Invalid Google Cloud API key. Please update the API key in the Supabase settings.');
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
    console.log("Audio format:", audioBlob.type);
    console.log("API Key length:", apiKey?.length || 0);

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

    console.log("Request config:", JSON.stringify(requestBody.config, null, 2));

    // Use API key as query parameter
    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log("Google Cloud API Response:", responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing Google Cloud API response:', e);
      throw new Error('Failed to parse Google Cloud API response');
    }

    if (!response.ok) {
      console.error('Google Cloud API Error Response:', responseData);
      
      const errorMessage = responseData.error?.message || 'Unknown error occurred';
      const errorDetails = responseData.error?.details?.[0]?.reason || '';
      
      throw new Error(
        `Google Cloud API Error: ${errorMessage}${errorDetails ? ` (${errorDetails})` : ''}\n` +
        'Please verify that your Google Cloud API key is valid and has the Speech-to-Text API enabled.'
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