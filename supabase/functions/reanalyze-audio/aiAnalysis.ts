interface AnalysisResult {
  summary: string;
  participants: Array<{ name: string; role: string }>;
  agendaItems: Array<{ title: string; discussion: string }>;
  actionItems: Array<{ task: string; responsible: string; deadline: string }>;
  nextSteps: string[];
}

export async function analyzeTranscription(
  transcriptionText: string,
  openAIApiKey: string
): Promise<AnalysisResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // Using the faster model
      messages: [
        {
          role: 'system',
          content: `Você é um assistente especializado em análise de transcrições de reuniões.
          Analise a transcrição fornecida e gere:
          1. Um resumo detalhado e estruturado da reunião
          2. Lista de participantes mencionados
          3. Principais pontos discutidos
          4. Ações e responsáveis
          5. Próximos passos definidos`
        },
        {
          role: 'user',
          content: transcriptionText
        }
      ],
      temperature: 0.7,
      max_tokens: 1000, // Reduced for faster processing
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI Analysis API error: ${response.statusText}`);
  }

  const analysisData = await response.json();
  return JSON.parse(analysisData.choices[0].message.content);
}