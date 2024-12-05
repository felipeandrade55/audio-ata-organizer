import { MeetingMinutes, ActionItem } from "@/types/meeting";

interface TriggerMatch {
  type: 'task' | 'reminder' | 'decision' | 'risk' | 'highlight' | 'deadline' | 'document' | 'legal' | 'confidential' | 'agreement';
  text: string;
  context: string;
}

const triggers = {
  task: [
    /vamos\s+criar\s+uma\s+tarefa[:\s]+(.+?)(?:\.|$)/i,
    /precisamos\s+fazer[:\s]+(.+?)(?:\.|$)/i,
    /fica\s+pendente[:\s]+(.+?)(?:\.|$)/i,
    /tarefa[:\s]+(.+?)(?:\.|$)/i,
    /providenciar[:\s]+(.+?)(?:\.|$)/i,
    /encaminhar[:\s]+(.+?)(?:\.|$)/i,
  ],
  reminder: [
    /precisamos\s+lembrar\s+(?:de\s+)?[:\s]+(.+?)(?:\.|$)/i,
    /não\s+podemos\s+esquecer\s+(?:de\s+)?[:\s]+(.+?)(?:\.|$)/i,
    /importante\s+lembrar[:\s]+(.+?)(?:\.|$)/i,
    /lembrete[:\s]+(.+?)(?:\.|$)/i,
    /atentar\s+para[:\s]+(.+?)(?:\.|$)/i,
  ],
  decision: [
    /ficou\s+decidido\s+que[:\s]+(.+?)(?:\.|$)/i,
    /a\s+decisão\s+(?:é|foi)[:\s]+(.+?)(?:\.|$)/i,
    /decidimos\s+que[:\s]+(.+?)(?:\.|$)/i,
    /acordamos\s+que[:\s]+(.+?)(?:\.|$)/i,
    /definimos\s+que[:\s]+(.+?)(?:\.|$)/i,
  ],
  risk: [
    /(?:existe|há)\s+(?:um|o)\s+risco\s+(?:de|que)[:\s]+(.+?)(?:\.|$)/i,
    /precisamos\s+ter\s+cuidado\s+com[:\s]+(.+?)(?:\.|$)/i,
    /risco[:\s]+(.+?)(?:\.|$)/i,
    /possível\s+problema[:\s]+(.+?)(?:\.|$)/i,
    /ponto\s+de\s+atenção[:\s]+(.+?)(?:\.|$)/i,
  ],
  highlight: [
    /isso\s+é\s+muito\s+importante[:\s]+(.+?)(?:\.|$)/i,
    /destaque\s+para[:\s]+(.+?)(?:\.|$)/i,
    /importante[:\s]+(.+?)(?:\.|$)/i,
    /fundamental[:\s]+(.+?)(?:\.|$)/i,
    /essencial[:\s]+(.+?)(?:\.|$)/i,
  ],
  deadline: [
    /prazo\s+(?:é|será)[:\s]+(.+?)(?:\.|$)/i,
    /(?:vence|vencimento)\s+(?:em|no\s+dia)[:\s]+(.+?)(?:\.|$)/i,
    /data\s+limite[:\s]+(.+?)(?:\.|$)/i,
    /até\s+o\s+dia[:\s]+(.+?)(?:\.|$)/i,
  ],
  document: [
    /(?:preciso|precisamos)\s+do\s+documento[:\s]+(.+?)(?:\.|$)/i,
    /(?:anexar|juntar)\s+(?:o|os|a|as)[:\s]+(.+?)(?:\.|$)/i,
    /documentação\s+necessária[:\s]+(.+?)(?:\.|$)/i,
    /preparar\s+(?:petição|contrato|documento)[:\s]+(.+?)(?:\.|$)/i,
  ],
  legal: [
    /base\s+legal[:\s]+(.+?)(?:\.|$)/i,
    /fundamento\s+jurídico[:\s]+(.+?)(?:\.|$)/i,
    /(?:lei|artigo|norma)\s+aplicável[:\s]+(.+?)(?:\.|$)/i,
    /jurisprudência[:\s]+(.+?)(?:\.|$)/i,
  ],
  confidential: [
    /informação\s+confidencial[:\s]+(.+?)(?:\.|$)/i,
    /sigilo[:\s]+(.+?)(?:\.|$)/i,
    /não\s+divulgar[:\s]+(.+?)(?:\.|$)/i,
    /protegido\s+por\s+sigilo[:\s]+(.+?)(?:\.|$)/i,
  ],
  agreement: [
    /as\s+partes\s+concordaram[:\s]+(.+?)(?:\.|$)/i,
    /acordo\s+firmado[:\s]+(.+?)(?:\.|$)/i,
    /termos\s+aceitos[:\s]+(.+?)(?:\.|$)/i,
    /consenso\s+sobre[:\s]+(.+?)(?:\.|$)/i,
  ],
};

export const findTriggers = (text: string): TriggerMatch[] => {
  const matches: TriggerMatch[] = [];

  Object.entries(triggers).forEach(([type, patterns]) => {
    patterns.forEach((pattern) => {
      const match = text.match(pattern);
      if (match) {
        matches.push({
          type: type as TriggerMatch['type'],
          text: match[1].trim(),
          context: text,
        });
      }
    });
  });

  return matches;
};

export const updateMinutesWithTriggers = (
  minutes: MeetingMinutes,
  matches: TriggerMatch[]
): MeetingMinutes => {
  const updatedMinutes = { ...minutes };

  matches.forEach((match) => {
    switch (match.type) {
      case 'task':
      case 'deadline': {
        const newTask: ActionItem = {
          task: match.text,
          responsible: '',
          deadline: match.type === 'deadline' ? match.text : '',
        };
        updatedMinutes.actionItems.push(newTask);
        break;
      }
      case 'reminder':
      case 'risk':
        if (!updatedMinutes.nextSteps.includes(match.text)) {
          updatedMinutes.nextSteps.push(match.text);
        }
        break;
      case 'decision':
      case 'agreement':
        if (updatedMinutes.agendaItems.length > 0) {
          const lastAgendaItem = updatedMinutes.agendaItems[updatedMinutes.agendaItems.length - 1];
          lastAgendaItem.decision = match.text;
        }
        break;
      case 'document':
      case 'legal':
      case 'highlight':
      case 'confidential':
        updatedMinutes.agendaItems.push({
          title: `${match.type.charAt(0).toUpperCase() + match.type.slice(1)}: ${match.text}`,
          discussion: match.context,
        });
        break;
    }
  });

  return updatedMinutes;
};