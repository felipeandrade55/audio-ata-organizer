interface VoiceProfile {
  name: string;
  audioFeatures: Float32Array[];
  lastSpeakTime: number;
  confidence: number;
}

class VoiceIdentificationService {
  public profiles: VoiceProfile[] = [];
  private speakerChangeThreshold = 1500; // 1.5 segundos
  private defaultSpeaker = "Participante Desconhecido";
  private minConfidenceThreshold = 0.6;
  private maxSamples = 5;

  public addProfile(name: string, audioData: Float32Array) {
    if (!name || name === this.defaultSpeaker) {
      return;
    }

    console.log(`Adicionando perfil de voz para: ${name}`);

    const existingProfile = this.profiles.find(p => p.name === name);
    if (existingProfile) {
      // Atualiza o perfil existente com novas amostras
      if (existingProfile.audioFeatures.length < this.maxSamples) {
        existingProfile.audioFeatures.push(audioData);
        existingProfile.confidence = Math.min(
          0.9,
          existingProfile.confidence + 0.1
        );
      }
    } else {
      this.profiles.push({
        name,
        audioFeatures: [audioData],
        lastSpeakTime: Date.now(),
        confidence: 0.7
      });
    }
  }

  private calculateSimilarity(sample1: Float32Array, sample2: Float32Array): number {
    const minLength = Math.min(sample1.length, sample2.length);
    let similarity = 0;
    
    for (let i = 0; i < minLength; i++) {
      const diff = Math.abs(sample1[i] - sample2[i]);
      similarity += 1 - (diff / 2); // Normaliza a diferença
    }
    
    return similarity / minLength;
  }

  public identifyMostSimilarSpeaker(audioFeatures: Float32Array, timestamp: number): string {
    if (this.profiles.length === 0) {
      return this.defaultSpeaker;
    }

    // Se houver apenas um perfil com confiança alta
    if (this.profiles.length === 1 && this.profiles[0].confidence > 0.8) {
      this.profiles[0].lastSpeakTime = timestamp;
      return this.profiles[0].name;
    }

    // Encontra o último falante
    const lastSpeaker = this.profiles.reduce((prev, current) => {
      return prev.lastSpeakTime > current.lastSpeakTime ? prev : current;
    });

    // Verifica o tempo desde a última fala
    const timeSinceLastSpeak = timestamp - lastSpeaker.lastSpeakTime;
    if (timeSinceLastSpeak < this.speakerChangeThreshold && lastSpeaker.confidence > 0.8) {
      lastSpeaker.lastSpeakTime = timestamp;
      return lastSpeaker.name;
    }

    // Calcula similaridade com todos os perfis
    const similarities = this.profiles.map(profile => {
      const avgSimilarity = profile.audioFeatures.reduce((sum, sample) => {
        return sum + this.calculateSimilarity(sample, audioFeatures);
      }, 0) / profile.audioFeatures.length;

      return {
        name: profile.name,
        similarity: avgSimilarity * profile.confidence
      };
    });

    // Encontra o perfil mais similar
    const mostSimilar = similarities.reduce((prev, current) => {
      return current.similarity > prev.similarity ? current : prev;
    });

    if (mostSimilar.similarity > this.minConfidenceThreshold) {
      const profile = this.profiles.find(p => p.name === mostSimilar.name)!;
      profile.lastSpeakTime = timestamp;
      profile.confidence = Math.min(0.95, profile.confidence + 0.05);
      return profile.name;
    }

    return this.defaultSpeaker;
  }

  public clear() {
    this.profiles = [];
  }
}

export const voiceIdentificationService = new VoiceIdentificationService();