import { voiceIdentificationService } from '../voiceIdentificationService';
import { handleNameRecognition } from '../nameRecognitionService';
import { toast } from "@/hooks/use-toast";

export const setupSpeechRecognition = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'pt-BR';

  recognition.onstart = () => {
    console.log('Reconhecimento de fala iniciado');
  };

  recognition.onerror = (event) => {
    console.error('Erro no reconhecimento de fala:', event.error);
    if (event.error === 'not-allowed') {
      toast({
        variant: "destructive",
        title: "Acesso ao microfone negado",
        description: "Por favor, permita o acesso ao microfone para usar o reconhecimento de fala."
      });
    }
  };

  recognition.onresult = (event) => {
    const last = event.results.length - 1;
    const text = event.results[last][0].transcript;
    
    handleNameRecognition(text).then(names => {
      if (names.length > 0) {
        voiceIdentificationService.addSpeakerNames(names);
      }
    });
  };

  return recognition;
};