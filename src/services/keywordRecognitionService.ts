import { MeetingMinutes } from "@/types/meeting";

interface KeywordMatch {
  type: 'meetingTitle' | 'agenda' | 'action' | 'nextStep' | 'participant';
  value: string;
  metadata?: Record<string, string>;
}

const patterns = {
  meetingTitle: [
    /a\s+pauta\s+(?:da\s+)?reunião\s+(?:de\s+hoje\s+)?(?:é|sera)\s+(?:falar\s+)?sobre\s+(.+?)(?:\.|$)/i,
    /(?:esta|essa)\s+reunião\s+(?:é|sera)\s+sobre\s+(.+?)(?:\.|$)/i,
  ],
  agenda: [
    /vamos\s+discutir\s+(?:sobre\s+)?(.+?)(?:\.|$)/i,
    /precisamos\s+falar\s+(?:sobre\s+)?(.+?)(?:\.|$)/i,
  ],
  action: [
    /(?:o|a)\s+(.+?)\s+ficou\s+responsável\s+por\s+(.+?)(?:\.|$)/i,
    /(.+?)\s+vai\s+(?:fazer|realizar)\s+(.+?)(?:\.|$)/i,
  ],
  nextStep: [
    /(?:o\s+)?próximo\s+passo\s+(?:é|sera)\s+(.+?)(?:\.|$)/i,
    /(?:depois|em\s+seguida)\s+(?:vamos|iremos)\s+(.+?)(?:\.|$)/i,
  ],
  participant: [
    /(?:eu\s+sou|meu\s+nome\s+é)\s+(.+?)(?:\.|$)/i,
    /(?:está|estou)\s+presente\s+(.+?)(?:\.|$)/i,
  ],
};

export const findKeywords = (text: string): KeywordMatch[] => {
  const matches: KeywordMatch[] = [];

  // Verifica cada tipo de padrão
  Object.entries(patterns).forEach(([type, patternList]) => {
    patternList.forEach((pattern) => {
      const match = text.match(pattern);
      if (match) {
        if (type === 'action') {
          matches.push({
            type: type as KeywordMatch['type'],
            value: match[2],
            metadata: {
              responsible: match[1],
            },
          });
        } else {
          matches.push({
            type: type as KeywordMatch['type'],
            value: match[1],
          });
        }
      }
    });
  });

  return matches;
};

export const updateMinutesWithKeywords = (
  minutes: MeetingMinutes,
  matches: KeywordMatch[]
): MeetingMinutes => {
  const updatedMinutes = { ...minutes };

  matches.forEach((match) => {
    switch (match.type) {
      case 'meetingTitle':
        updatedMinutes.meetingTitle = match.value;
        break;
      case 'agenda':
        if (!updatedMinutes.agendaItems.some(item => item.title === match.value)) {
          updatedMinutes.agendaItems.push({
            title: match.value,
            discussion: '',
          });
        }
        break;
      case 'action':
        if (match.metadata?.responsible) {
          updatedMinutes.actionItems.push({
            task: match.value,
            responsible: match.metadata.responsible,
            deadline: '',
            priority: 'medium',
            status: 'pending'
          });
        }
        break;
      case 'nextStep':
        if (!updatedMinutes.nextSteps.includes(match.value)) {
          updatedMinutes.nextSteps.push(match.value);
        }
        break;
      case 'participant':
        if (!updatedMinutes.participants.some(p => p.name === match.value)) {
          updatedMinutes.participants.push({
            name: match.value,
          });
        }
        break;
    }
  });

  return updatedMinutes;
};
