interface EmotionAnalysis {
  text: string;
  emotion: string;
  confidence: number;
}

export const analyzeEmotions = async (audioBlob: Blob, apiKey: string): Promise<EmotionAnalysis[]> => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('language', 'pt');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Falha na análise de emoções');
    }

    const result = await response.json();
    
    // Analisar emoções usando o GPT-4
    const emotionPrompt = `
      Analise o seguinte texto e identifique emoções expressas (como risos, choro, gritos, palavrões, etc).
      Retorne um array JSON com objetos contendo:
      - text: o trecho do texto
      - emotion: o tipo de emoção detectada
      - confidence: nível de confiança (0-1)
      
      Texto: ${result.text}
    `;

    const emotionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em análise de emoções em textos.'
          },
          {
            role: 'user',
            content: emotionPrompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!emotionResponse.ok) {
      throw new Error('Falha na análise de emoções');
    }

    const emotionResult = await emotionResponse.json();
    return JSON.parse(emotionResult.choices[0].message.content);
  } catch (error) {
    console.error('Erro na análise de emoções:', error);
    return [];
  }
};