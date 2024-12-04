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
    const prompt = `
      Analise o texto desta transcrição de reunião e extraia as seguintes informações em formato JSON:
      - Título da reunião
      - Local (se mencionado, caso contrário use "Reunião Virtual")
      - Organizador/Apresentador
      - Lista de participantes com seus papéis (se mencionados)
      - Itens da pauta com discussões e decisões
      - Ações definidas com responsáveis e prazos
      - Resumo geral da reunião
      - Próximos passos definidos

      Texto da transcrição:
      ${transcriptionText}

      Por favor, formate a resposta como um objeto JSON seguindo exatamente esta estrutura:
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
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um assistente especializado em análise de transcrições de reuniões.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("Falha na análise da transcrição");
    }

    const data = await response.json();
    const analysis: AnalysisResponse = JSON.parse(data.choices[0].message.content);

    // Formata a data atual
    const currentDate = new Date().toLocaleDateString("pt-BR");
    const currentTime = new Date().toLocaleTimeString("pt-BR");

    return {
      date: currentDate,
      startTime: currentTime,
      endTime: currentTime, // Será atualizado quando a gravação terminar
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