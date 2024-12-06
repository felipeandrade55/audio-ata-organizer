interface CalendarIntent {
  type: 'meeting' | 'task' | 'deadline';
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

const datePatterns = {
  fullDate: /(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\s+(?:de\s+)?(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?:\s+de\s+\d{4})?)/i,
  time: /(\d{1,2}:\d{2}(?:\s*[AaPp][Mm])?)/i,
};

const intentPatterns = [
  {
    type: 'meeting' as const,
    patterns: [
      /agendar\s+(?:uma\s+)?reunião\s+(?:para|em|no dia)\s+(.+?)(?:\.|$)/i,
      /marcar\s+(?:uma\s+)?reunião\s+(?:para|em|no dia)\s+(.+?)(?:\.|$)/i,
      /próxima\s+reunião\s+(?:será|acontece(?:rá)?)\s+(?:em|no dia)\s+(.+?)(?:\.|$)/i,
    ],
  },
  {
    type: 'task' as const,
    patterns: [
      /agendar\s+(?:uma\s+)?tarefa\s+(?:para|em|no dia)\s+(.+?)(?:\.|$)/i,
      /marcar\s+(?:uma\s+)?atividade\s+(?:para|em|no dia)\s+(.+?)(?:\.|$)/i,
      /prazo\s+(?:é|será)\s+(?:até|em|no dia)\s+(.+?)(?:\.|$)/i,
    ],
  },
  {
    type: 'deadline' as const,
    patterns: [
      /deadline\s+(?:é|será)\s+(?:até|em|no dia)\s+(.+?)(?:\.|$)/i,
      /vencimento\s+(?:é|será)\s+(?:em|no dia)\s+(.+?)(?:\.|$)/i,
      /data\s+limite\s+(?:é|será)\s+(?:em|no dia)\s+(.+?)(?:\.|$)/i,
    ],
  },
];

export const findCalendarIntents = (text: string): CalendarIntent[] => {
  const intents: CalendarIntent[] = [];
  
  intentPatterns.forEach(({ type, patterns }) => {
    patterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        const contextText = match[1];
        const dateMatch = contextText.match(datePatterns.fullDate);
        const timeMatch = contextText.match(datePatterns.time);
        
        if (dateMatch || timeMatch) {
          intents.push({
            type,
            title: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${contextText}`,
            description: match[0],
            startTime: dateMatch ? dateMatch[1] : undefined,
            endTime: timeMatch ? timeMatch[1] : undefined,
          });
        }
      }
    });
  });
  
  return intents;
};

export const extractDateFromText = (text: string): Date | null => {
  const dateMatch = text.match(datePatterns.fullDate);
  if (!dateMatch) return null;

  const dateText = dateMatch[1];
  const parts = dateText.split('/');
  
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  return null;
};