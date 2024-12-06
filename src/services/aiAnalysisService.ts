import { MeetingMinutes } from "@/types/meeting";

export const analyzeTranscription = async (
  transcription: string,
  apiKey: string
): Promise<MeetingMinutes | null> => {
  try {
    console.log("Analisando transcrição com IA...");
    
    if (!apiKey) {
      throw new Error('API key não configurada');
    }

    const currentDate = new Date().toLocaleDateString("pt-BR");

    const systemPrompt = `Você é um assistente especializado em analisar transcrições de reuniões em português e extrair informações relevantes para criar atas detalhadas. 
    Considere o contexto profissional e legal brasileiro.
    
    Ao analisar a transcrição:
    1. Identifique o título mais apropriado baseado no conteúdo discutido
    2. Reconheça todos os participantes e seus papéis mencionados
    3. Organize os itens da agenda baseado em tópicos discutidos
    4. Extraia ações concretas e seus responsáveis
    5. Crie um resumo executivo focado nos pontos principais
    6. Liste os próximos passos de forma clara e acionável
    
    Mantenha um tom profissional e objetivo.`;

    const userPrompt = `
      Analise a seguinte transcrição e extraia as informações no formato JSON especificado:
      
      ${transcription}
      
      Formato esperado:
      {
        "meetingTitle": "string",
        "participants": [{ "name": "string", "role": "string" }],
        "agendaItems": [{ 
          "title": "string", 
          "discussion": "string", 
          "responsible": "string", 
          "decision": "string" 
        }],
        "actionItems": [{ 
          "task": "string", 
          "responsible": "string", 
          "deadline": "string",
          "priority": "high" | "medium" | "low"
        }],
        "summary": "string",
        "nextSteps": ["string"]
      }`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Resposta da OpenAI:", data);

    const analysis = JSON.parse(data.choices[0].message.content);
    console.log("Análise processada:", analysis);

    const currentTime = new Date().toLocaleTimeString("pt-BR");

    return {
      id: crypto.randomUUID(),
      date: currentDate,
      startTime: currentTime,
      endTime: currentTime,
      location: "Virtual - Gravação de Áudio",
      meetingTitle: analysis.meetingTitle || "Reunião sem título",
      organizer: "",
      participants: analysis.participants || [],
      agendaItems: analysis.agendaItems.map((item: any, index: number) => ({
        ...item,
        order_index: index
      })) || [],
      actionItems: analysis.actionItems.map((item: any) => ({
        ...item,
        status: "pending"
      })) || [],
      summary: analysis.summary || "",
      nextSteps: analysis.nextSteps || [],
      author: "Sistema de Transcrição",
      meetingType: "transcribed",
      confidentialityLevel: "internal",
      legalReferences: [],
      version: 1,
      status: "draft",
      lastModified: new Date().toISOString(),
      tags: [],
      apiKey: apiKey,
    };
  } catch (error) {
    console.error("Erro na análise da transcrição:", error);
    return null;
  }
};