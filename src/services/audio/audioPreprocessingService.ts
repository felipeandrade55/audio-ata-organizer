import { AudioProcessor, NoiseReductionConfig, AudioAnalyzerConfig } from './types';
import { NoiseReductionService } from './noiseReduction';
import { FrequencyAnalyzerService } from './frequencyAnalyzer';

export class AudioPreprocessingService implements AudioProcessor {
  private context: AudioContext;
  private noiseReduction: NoiseReductionService;
  private frequencyAnalyzer: FrequencyAnalyzerService;

  constructor() {
    this.context = new AudioContext();
    
    const noiseConfig: NoiseReductionConfig = {
      threshold: -50,
      knee: 40,
      ratio: 12,
      attack: 0,
      release: 0.25
    };

    const analyzerConfig: AudioAnalyzerConfig = {
      fftSize: 2048,
      smoothingTimeConstant: 0.8
    };

    this.noiseReduction = new NoiseReductionService(this.context, noiseConfig);
    this.frequencyAnalyzer = new FrequencyAnalyzerService(this.context, analyzerConfig);
  }

  async processAudioStream(stream: MediaStream): Promise<MediaStream> {
    const source = this.context.createMediaStreamSource(stream);
    const destination = this.context.createMediaStreamDestination();

    // Create processing chain
    const noiseReducer = this.noiseReduction.connect(source);
    const analyzer = this.frequencyAnalyzer.connect(noiseReducer);
    analyzer.connect(destination);

    return destination.stream;
  }

  dispose() {
    this.context.close();
  }
}

export const createAudioPreprocessor = () => new AudioPreprocessingService();