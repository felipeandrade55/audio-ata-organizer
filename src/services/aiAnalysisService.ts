import { MeetingMinutes } from "@/types/meeting";

interface AnalysisResponse {
  meetingTitle: string;
  location: string;
  organizer: string;
  participants: Array<{ name: string; role?: string }>;
  agendaItems: Array<{
    title: string;
    discussion?: string;
    responsible?: string;
    decision?: string;
  }>;
  actionItems: Array<{
    task: string;
    responsible: string;
    deadline: string;
  }>;
  summary: string;
  nextSteps: string[];
}

export const analyzeTranscription = async (
  transcriptionText: string,
  apiKey: string
): Promise<MeetingMinutes | null> => {
  try {
    console.log("Analisando transcrição:", transcriptionText);

    const prompt = `
      Analise o texto desta transcrição de reunião e extraia as informações em formato JSON.
      Preste especial atenção a:
      1. Tarefas mencionadas (quando alguém diz "vamos criar uma tarefa", "precisamos fazer", etc)
      2. Decisões tomadas (quando alguém diz "ficou decidido que", etc)
      3. Lembretes importantes (quando alguém diz "precisamos lembrar de", etc)
      4. Riscos identificados (quando alguém menciona "existe um risco", etc)
      5. Pontos importantes (quando alguém diz "isso é muito importante", etc)

      Retorne APENAS um objeto JSON com a seguinte estrutura, sem texto adicional ou explicações:
      {
        "meetingTitle": "string",
        "location": "string",
        "organizer": "string",
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
          "deadline": "string"
        }],
        "summary": "string",
        "nextSteps": ["string"]
      }

      Texto da transcrição:
      ${transcriptionText}
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
            content: "Você é um assistente especializado em análise de transcrições de reuniões. Retorne APENAS JSON válido, sem texto adicional.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3, // Reduzindo a temperatura para respostas mais consistentes
        response_format: { type: "json_object" }, // Forçando resposta em JSON
      }),
    });

    if (!response.ok) {
      throw new Error("Falha na análise da transcrição");
    }

    const data = await response.json();
    console.log("Resposta da API:", data.choices[0].message.content);
    
    const analysis: AnalysisResponse = JSON.parse(data.choices[0].message.content);

    // Formata a data atual
    const currentDate = new Date().toLocaleDateString("pt-BR");
    const currentTime = new Date().toLocaleTimeString("pt-BR");

    return {
      date: currentDate,
      startTime: currentTime,
      endTime: currentTime,
      location: analysis.location,
      meetingTitle: analysis.meetingTitle,
      organizer: analysis.organizer,
      participants: analysis.participants,
      agendaItems: analysis.agendaItems,
      actionItems: analysis.actionItems,
      summary: analysis.summary,
      nextSteps: analysis.nextSteps,
      author: "Sistema de Transcrição com IA",
      approver: "",
    };
  } catch (error) {
    console.error("Erro na análise da transcrição:", error);
    return null;
  }
};