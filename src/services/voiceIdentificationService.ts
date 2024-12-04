interface VoiceProfile {
  name: string;
  audioFeatures: Float32Array;
  lastSpeakTime: number;
}

class VoiceIdentificationService {
  public profiles: VoiceProfile[] = [];
  private speakerChangeThreshold = 2000; // 2 segundos em milissegundos
  private defaultSpeaker = "Participante Desconhecido";

  public addProfile(name: string, audioData: Float32Array) {
    // Não adiciona perfil se o nome estiver vazio ou for o padrão
    if (!name || name === this.defaultSpeaker) {
      return;
    }

    // Verifica se já existe um perfil com este nome
    const existingProfile = this.profiles.find(p => p.name === name);
    if (!existingProfile) {
      this.profiles.push({
        name,
        audioFeatures: audioData,
        lastSpeakTime: Date.now()
      });
    }
  }

  public identifyMostSimilarSpeaker(audioFeatures: Float32Array, timestamp: number): string {
    if (this.profiles.length === 0) {
      return this.defaultSpeaker;
    }

    // Se houver apenas um perfil, retorna ele
    if (this.profiles.length === 1) {
      this.profiles[0].lastSpeakTime = timestamp;
      return this.profiles[0].name;
    }

    // Encontra o último falante
    const lastSpeaker = this.profiles.reduce((prev, current) => {
      return prev.lastSpeakTime > current.lastSpeakTime ? prev : current;
    });

    // Se o tempo desde a última fala for menor que o threshold, mantém o mesmo falante
    const timeSinceLastSpeak = timestamp - lastSpeaker.lastSpeakTime;
    if (timeSinceLastSpeak < this.speakerChangeThreshold) {
      lastSpeaker.lastSpeakTime = timestamp;
      return lastSpeaker.name;
    }

    // Caso contrário, alterna para outro participante
    const currentIndex = this.profiles.findIndex(p => p.name === lastSpeaker.name);
    const nextIndex = (currentIndex + 1) % this.profiles.length;
    this.profiles[nextIndex].lastSpeakTime = timestamp;
    
    return this.profiles[nextIndex].name;
  }

  public clear() {
    this.profiles = [];
  }
}

export const voiceIdentificationService = new VoiceIdentificationService();