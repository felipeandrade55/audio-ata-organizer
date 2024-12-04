import { AudioAnalyzerConfig } from './types';

export class FrequencyAnalyzerService {
  private analyzer: AnalyserNode;

  constructor(context: AudioContext, config: AudioAnalyzerConfig) {
    this.analyzer = context.createAnalyser();
    this.configure(config);
  }

  private configure(config: AudioAnalyzerConfig) {
    this.analyzer.fftSize = config.fftSize;
    this.analyzer.smoothingTimeConstant = config.smoothingTimeConstant;
  }

  connect(source: AudioNode): AnalyserNode {
    source.connect(this.analyzer);
    return this.analyzer;
  }

  async processVoiceFrequencies(audioData: Float32Array): Promise<Float32Array> {
    const bufferLength = this.analyzer.frequencyBinCount;
    const frequencyData = new Float32Array(bufferLength);
    this.analyzer.getFloatFrequencyData(frequencyData);

    const sampleRate = this.analyzer.context.sampleRate;
    const binSize = sampleRate / bufferLength;
    
    for (let i = 0; i < bufferLength; i++) {
      const frequency = i * binSize;
      if (frequency < 100 || frequency > 3000) {
        frequencyData[i] = -100;
      }
    }

    return audioData;
  }
}