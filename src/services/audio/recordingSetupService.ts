import { toast } from "@/components/ui/use-toast";

export const validateApiKey = (apiKey: string, transcriptionService: 'openai' | 'google') => {
  if (!apiKey) {
    toast({
      title: "Erro",
      description: `Por favor, configure sua chave da API ${transcriptionService === 'openai' ? 'OpenAI' : 'Google Cloud'} nas variáveis de ambiente.`,
      variant: "destructive",
    });
    return false;
  }
  return true;
};

export const setupMicrophoneStream = async () => {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    }
  });
};