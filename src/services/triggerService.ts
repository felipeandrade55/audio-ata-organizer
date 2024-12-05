import { MeetingMinutes, ActionItem } from "@/types/meeting";

interface TriggerMatch {
  type: 'task' | 'reminder' | 'decision' | 'risk' | 'highlight';
  text: string;
  context: string;
}

const triggers = {
  task: [
    /vamos\s+criar\s+uma\s+tarefa[:\s]+(.+?)(?:\.|$)/i,
    /precisamos\s+fazer[:\s]+(.+?)(?:\.|$)/i,
    /fica\s+pendente[:\s]+(.+?)(?:\.|$)/i,
    /tarefa[:\s]+(.+?)(?:\.|$)/i,
  ],
  reminder: [
    /precisamos\s+lembrar\s+(?:de\s+)?[:\s]+(.+?)(?:\.|$)/i,
    /não\s+podemos\s+esquecer\s+(?:de\s+)?[:\s]+(.+?)(?:\.|$)/i,
    /importante\s+lembrar[:\s]+(.+?)(?:\.|$)/i,
    /lembrete[:\s]+(.+?)(?:\.|$)/i,
  ],
  decision: [
    /ficou\s+decidido\s+que[:\s]+(.+?)(?:\.|$)/i,
    /a\s+decisão\s+(?:é|foi)[:\s]+(.+?)(?:\.|$)/i,
    /decidimos\s+que[:\s]+(.+?)(?:\.|$)/i,
  ],
  risk: [
    /(?:existe|há)\s+(?:um|o)\s+risco\s+(?:de|que)[:\s]+(.+?)(?:\.|$)/i,
    /precisamos\s+ter\s+cuidado\s+com[:\s]+(.+?)(?:\.|$)/i,
    /risco[:\s]+(.+?)(?:\.|$)/i,
  ],
  highlight: [
    /isso\s+é\s+muito\s+importante[:\s]+(.+?)(?:\.|$)/i,
    /destaque\s+para[:\s]+(.+?)(?:\.|$)/i,
    /importante[:\s]+(.+?)(?:\.|$)/i,
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
      case 'task': {
        const newTask: ActionItem = {
          task: match.text,
          responsible: '',
          deadline: '',
        };
        updatedMinutes.actionItems.push(newTask);
        break;
      }
      case 'reminder':
        if (!updatedMinutes.nextSteps.includes(match.text)) {
          updatedMinutes.nextSteps.push(match.text);
        }
        break;
      case 'decision':
        if (updatedMinutes.agendaItems.length > 0) {
          const lastAgendaItem = updatedMinutes.agendaItems[updatedMinutes.agendaItems.length - 1];
          lastAgendaItem.decision = match.text;
        } else {
          updatedMinutes.agendaItems.push({
            title: 'Decisão',
            discussion: match.context,
            decision: match.text,
          });
        }
        break;
      case 'risk':
        updatedMinutes.agendaItems.push({
          title: 'Risco Identificado',
          discussion: match.text,
        });
        break;
      case 'highlight':
        updatedMinutes.agendaItems.push({
          title: 'Ponto Importante',
          discussion: match.text,
        });
        break;
    }
  });

  return updatedMinutes;
};