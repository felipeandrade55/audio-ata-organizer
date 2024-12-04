import { NoiseReductionConfig } from './types';

export class NoiseReductionService {
  private compressor: DynamicsCompressorNode;

  constructor(context: AudioContext, config: NoiseReductionConfig) {
    this.compressor = context.createDynamicsCompressor();
    this.configure(config);
  }

  private configure(config: NoiseReductionConfig) {
    this.compressor.threshold.value = config.threshold;
    this.compressor.knee.value = config.knee;
    this.compressor.ratio.value = config.ratio;
    this.compressor.attack.value = config.attack;
    this.compressor.release.value = config.release;
  }

  connect(source: AudioNode): DynamicsCompressorNode {
    source.connect(this.compressor);
    return this.compressor;
  }
}