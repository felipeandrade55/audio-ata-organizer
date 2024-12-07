export interface TranscriptionRecord {
  id: string;
  audio_path: string;
  status: string;
  created_at: string;
  error_message?: string;
  retry_count: number;
  size?: number;
  duration?: string;
  ai_processed?: boolean;
  transcription_text?: string;
  sentiment_analysis?: any;
  key_moments?: any;
  original_filename?: string;
  participants_count?: number;
  tags?: string[];
  confidence?: number;
}