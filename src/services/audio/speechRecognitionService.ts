import { voiceIdentificationService } from '../voiceIdentificationService';
import { handleNameRecognition } from '../nameRecognitionService';
import { toast } from "@/components/ui/use-toast";

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

  recognition.onresult = async (event) => {
    const last = event.results.length - 1;
    const text = event.results[last][0].transcript;
    
    const name = await handleNameRecognition(text);
    if (name) {
      // Create a mock audio data for the profile
      const mockAudioData = new Float32Array(1024);
      voiceIdentificationService.addProfile(name, mockAudioData);
    }
  };

  return recognition;
};