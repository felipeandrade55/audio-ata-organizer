export interface Segment {
  speaker: string;
  text: string;
  timestamp: string;
  start: number;  // Timestamp in milliseconds when the phrase started
  end: number;    // Timestamp in milliseconds when the phrase ended
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