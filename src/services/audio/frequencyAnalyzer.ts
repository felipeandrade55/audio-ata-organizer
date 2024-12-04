import { AudioAnalyzerConfig } from './types';

export class FrequencyAnalyzerService {
  private analyzer: AnalyserNode;
  private noiseDetectionCallback?: (isNoisy: boolean) => void;
  private lastNoiseCheck: number = 0;
  private readonly NOISE_CHECK_INTERVAL = 1000; // Check every second
  private readonly NOISE_THRESHOLD = -50; // Adjust this value based on testing

  constructor(context: AudioContext, config: AudioAnalyzerConfig) {
    this.analyzer = context.createAnalyser();
    this.configure(config);
    this.startNoiseDetection();
  }

  private configure(config: AudioAnalyzerConfig) {
    this.analyzer.fftSize = config.fftSize;
    this.analyzer.smoothingTimeConstant = config.smoothingTimeConstant;
  }

  connect(source: AudioNode): AnalyserNode {
    source.connect(this.analyzer);
    return this.analyzer;
  }

  setNoiseCallback(callback: (isNoisy: boolean) => void) {
    this.noiseDetectionCallback = callback;
  }

  private startNoiseDetection() {
    const checkNoise = () => {
      if (!this.noiseDetectionCallback) return;
      
      const now = Date.now();
      if (now - this.lastNoiseCheck < this.NOISE_CHECK_INTERVAL) return;
      this.lastNoiseCheck = now;

      const bufferLength = this.analyzer.frequencyBinCount;
      const frequencyData = new Float32Array(bufferLength);
      this.analyzer.getFloatFrequencyData(frequencyData);

      // Calculate average noise level
      let sum = 0;
      let count = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const frequency = (i * this.analyzer.context.sampleRate) / this.analyzer.fftSize;
        // Focus on frequencies typically associated with background noise
        if (frequency > 100 && frequency < 500) {
          sum += frequencyData[i];
          count++;
        }
      }

      const averageNoiseLevel = sum / count;
      const isNoisy = averageNoiseLevel > this.NOISE_THRESHOLD;
      this.noiseDetectionCallback(isNoisy);
    };

    // Run noise detection continuously
    const animate = () => {
      checkNoise();
      requestAnimationFrame(animate);
    };
    animate();
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