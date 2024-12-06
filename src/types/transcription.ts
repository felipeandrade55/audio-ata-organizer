export interface Segment {
  speaker: string;
  text: string;
  timestamp: string;
  start: number;  // Adicionado
  end: number;    // Adicionado
  emotion?: {
    type: string;
    confidence: number;
  };
  triggers?: {
    type: 'task' | 'reminder' | 'decision' | 'risk' | 'highlight' | 'deadline' | 'document' | 'legal' | 'confidential' | 'agreement' | 'followup' | 'schedule' | 'note';
    text: string;
    context?: string;
  }[];
}

export type TranscriptionSegment = Segment;