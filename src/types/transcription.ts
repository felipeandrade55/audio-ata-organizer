export interface Segment {
  speaker: string;
  text: string;
  timestamp: string;
  emotion?: {
    type: string;
    confidence: number;
  };
  triggers?: {
    type: 'task' | 'reminder' | 'decision' | 'risk' | 'highlight';
    text: string;
  }[];
}

export type TranscriptionSegment = Segment;