import { toast } from "@/hooks/use-toast";

export const validateApiKey = (apiKey: string, transcriptionService: 'openai' | 'google') => {
  if (!apiKey) {
    toast({
      variant: "destructive",
      title: "Chave de API não encontrada",
      description: `Configure uma chave de API válida para ${transcriptionService === 'openai' ? 'OpenAI' : 'Google Cloud'} nas configurações.`
    });
    return false;
  }
  return true;
};

export const setupMicrophoneStream = async () => {
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    console.error('Erro ao acessar microfone:', error);
    throw error;
  }
};