import { toast } from "@/components/ui/use-toast";

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
    // Primeiro, verificamos se o navegador suporta a API de mídia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        variant: "destructive",
        title: "Navegador não suportado",
        description: "Seu navegador não suporta gravação de áudio. Por favor, use um navegador mais recente."
      });
      throw new Error("Browser não suporta getUserMedia");
    }

    // Solicita permissão para acessar o microfone
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    
    return stream;
  } catch (error) {
    console.error('Erro ao acessar microfone:', error);
    
    // Tratamento específico para diferentes tipos de erro
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast({
          variant: "destructive",
          title: "Permissão negada",
          description: "Você precisa permitir o acesso ao microfone nas configurações do seu navegador."
        });
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        toast({
          variant: "destructive",
          title: "Microfone não encontrado",
          description: "Nenhum microfone foi detectado. Verifique se há um microfone conectado ao seu dispositivo."
        });
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        toast({
          variant: "destructive",
          title: "Erro de hardware",
          description: "Não foi possível acessar o microfone. Ele pode estar sendo usado por outro aplicativo."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao acessar microfone",
          description: "Ocorreu um erro ao tentar acessar o microfone. Verifique as permissões e tente novamente."
        });
      }
    }
    throw error;
  }
};