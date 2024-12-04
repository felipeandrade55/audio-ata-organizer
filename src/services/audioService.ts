export const playIdentificationPrompt = () => {
  return new Promise<void>((resolve) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(
      "Por favor, cada participante deve se apresentar dizendo seu nome e uma breve descrição. Após todos se apresentarem, a gravação da reunião será iniciada."
    );
    utterance.lang = 'pt-BR';
    utterance.onend = () => {
      resolve();
    };
    synth.speak(utterance);
  });
};