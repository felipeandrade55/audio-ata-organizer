import { MeetingMinutes } from "@/types/meeting";

export const analyzeTranscription = async (
  transcription: string,
  apiKey: string
): Promise<MeetingMinutes | null> => {
  try {
    console.log("Analisando transcrição com IA...");
    console.log("Comprimento da transcrição:", transcription.length);
    console.log("Primeiros 100 caracteres:", transcription.substring(0, 100));

    const currentDate = new Date().toLocaleDateString("pt-BR");

    const prompt = `
      Analise a transcrição abaixo e extraia as seguintes informações:
      - Título da reunião
      - Participantes e seus papéis
      - Itens da agenda discutidos
      - Ações necessárias
      - Resumo geral
      - Próximos passos

      Transcrição:
      ${transcription}

      Responda em formato JSON com as seguintes chaves:
      {
        "meetingTitle": "string",
        "participants": [{ "name": "string", "role": "string" }],
        "agendaItems": [{ "title": "string", "discussion": "string", "responsible": "string", "decision": "string" }],
        "actionItems": [{ "task": "string", "responsible": "string", "deadline": "string" }],
        "summary": "string",
        "nextSteps": ["string"]
      }
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente especializado em analisar transcrições de reuniões e extrair informações relevantes.",
          },
          {
            role: "user",
            content: prompt,
          },
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
      id: crypto.randomUUID(), // Generate a unique ID for the meeting
      date: currentDate,
      startTime: currentTime,
      endTime: currentTime,
      location: "Virtual - Gravação de Áudio",
      meetingTitle: analysis.meetingTitle || "Reunião sem título",
      organizer: "",
      participants: analysis.participants || [],
      agendaItems: analysis.agendaItems || [],
      actionItems: analysis.actionItems || [],
      summary: analysis.summary || "",
      nextSteps: analysis.nextSteps || [],
      author: "Sistema de Transcrição",
      meetingType: "initial",
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