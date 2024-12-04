export interface AudioProcessor {
  processAudioStream(stream: MediaStream): Promise<MediaStream>;
  dispose(): void;
}

export interface NoiseReductionConfig {
  threshold: number;
  knee: number;
  ratio: number;
  attack: number;
  release: number;
}

export interface AudioAnalyzerConfig {
  fftSize: number;
  smoothingTimeConstant: number;
}