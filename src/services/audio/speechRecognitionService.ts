import { voiceIdentificationService } from '../voiceIdentificationService';
import { handleNameRecognition } from '../nameRecognitionService';
import { toast } from "sonner";

export const setupSpeechRecognition = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  
  recognition.lang = 'pt-BR';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      const name = handleNameRecognition(transcript);

      if (name && !voiceIdentificationService.profiles.find(p => p.name === name)) {
        voiceIdentificationService.addProfile(name, new Float32Array(0));
        toast({
          title: "Novo participante identificado",
          description: `Identificamos o participante: ${name}`,
        });
      }
    }
  };

  return recognition;
};