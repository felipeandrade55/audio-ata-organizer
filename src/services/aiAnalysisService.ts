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
      Analise o texto desta transcrição de reunião entre advogado e cliente e extraia as informações em formato JSON.
      Preste especial atenção a:
      1. Tarefas e providências a serem tomadas
      2. Prazos mencionados (processuais ou não)
      3. Documentos necessários ou a serem preparados
      4. Decisões e acordos estabelecidos
      5. Informações confidenciais ou sigilosas
      6. Bases legais e jurisprudência citadas
      7. Riscos identificados
      8. Pontos importantes destacados
      9. Próximos passos e lembretes

      Identifique especialmente quando alguém mencionar:
      - "vamos criar uma tarefa", "precisamos fazer", "providenciar", "encaminhar"
      - "prazo", "vence em", "data limite", "até o dia"
      - "precisamos do documento", "anexar", "juntar", "documentação necessária"
      - "ficou decidido que", "acordamos que", "as partes concordaram"
      - "informação confidencial", "sigilo", "não divulgar"
      - "base legal", "fundamento jurídico", "lei aplicável", "jurisprudência"
      - "existe um risco", "ponto de atenção", "possível problema"
      - "isso é muito importante", "fundamental", "essencial"
      - "precisamos lembrar", "atentar para", "não podemos esquecer"

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
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um assistente especializado em análise de transcrições de reuniões jurídicas. Retorne APENAS JSON válido, sem texto adicional.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error("Falha na análise da transcrição");
    }

    const data = await response.json();
    console.log("Resposta da API:", data.choices[0].message.content);
    
    const analysis: AnalysisResponse = JSON.parse(data.choices[0].message.content);

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