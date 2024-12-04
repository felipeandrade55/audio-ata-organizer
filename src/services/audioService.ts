import { voiceIdentificationService } from './voiceIdentificationService';

export const playIdentificationPrompt = () => {
  return new Promise<void>((resolve) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(
      "Por favor, cada participante deve se apresentar dizendo: Meu nome é, seguido de seu nome. Aguarde alguns segundos entre cada apresentação. Após todos se apresentarem, a gravação da reunião será iniciada."
    );
    utterance.lang = 'pt-BR';
    utterance.onend = () => {
      startListeningForIntroductions().then(resolve);
    };
    synth.speak(utterance);
  });
};

const startListeningForIntroductions = async () => {
  return new Promise<void>((resolve) => {
    let isListening = true;
    const timeoutId = setTimeout(() => {
      isListening = false;
      resolve();
    }, 30000); // 30 segundos para as apresentações

    const processAudio = async (stream: MediaStream) => {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      source.connect(analyzer);

      const processChunk = () => {
        if (!isListening) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        const audioData = new Float32Array(analyzer.frequencyBinCount);
        analyzer.getFloatTimeDomainData(audioData);

        // Detecta se há fala acontecendo (simplificado)
        const isSpeaking = audioData.some(value => Math.abs(value) > 0.1);

        if (isSpeaking) {
          // Extrai o nome da fala (em uma implementação real, isso usaria
          // reconhecimento de fala para extrair o nome real)
          const mockName = `Participante ${voiceIdentificationService.profiles.length + 1}`;
          voiceIdentificationService.addProfile(mockName, audioData);
        }

        requestAnimationFrame(processChunk);
      };

      processChunk();
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(processAudio)
      .catch(console.error);
  });
};