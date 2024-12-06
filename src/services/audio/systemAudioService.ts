import { toast } from "@/hooks/use-toast";

interface AudioStreamResult {
  stream: MediaStream;
  cleanup?: () => void;
}

// Define a custom interface for our audio constraints
interface CustomAudioConstraints extends MediaTrackConstraints {
  suppressLocalAudioPlayback?: boolean;
}

export const setupSystemAudio = async (micStream: MediaStream, audioContext: AudioContext): Promise<AudioStreamResult> => {
  try {
    console.log('Iniciando configuração do áudio do sistema...');
    
    // Verifica se o navegador suporta captação de áudio do sistema
    if (!navigator.mediaDevices || !('getDisplayMedia' in navigator.mediaDevices)) {
      console.error('Navegador não suporta getDisplayMedia');
      toast({
        variant: "destructive",
        title: "Navegador não suportado",
        description: "Seu navegador não suporta a gravação do áudio do sistema. Por favor, use o Chrome ou Edge mais recente."
      });
      throw new Error("Navegador não suporta captação de áudio do sistema");
    }

    console.log('Solicitando permissão para captura de áudio do sistema...');
    
    // Define as constraints com type assertion
    const constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
        autoGainControl: true,
        suppressLocalAudioPlayback: false // Importante para Chrome
      } as CustomAudioConstraints,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop'
        }
      }
    };

    // @ts-ignore - TypeScript não reconhece getDisplayMedia ainda
    const displayStream = await navigator.mediaDevices.getDisplayMedia(constraints);

    console.log('Permissão concedida, verificando faixas de áudio...');

    // Verifica se conseguimos capturar o áudio
    const audioTracks = displayStream.getAudioTracks();
    console.log('Faixas de áudio disponíveis:', audioTracks.length);
    
    if (audioTracks.length === 0) {
      toast({
        variant: "destructive",
        title: "Áudio não disponível",
        description: "Não foi possível capturar o áudio do sistema. Certifique-se de selecionar 'Compartilhar áudio' na janela de compartilhamento do Chrome."
      });
      throw new Error("Nenhuma fonte de áudio selecionada");
    }

    console.log('Configurando nós de áudio...');

    const systemSource = audioContext.createMediaStreamSource(displayStream);
    const micSource = audioContext.createMediaStreamSource(micStream);
    
    const destination = audioContext.createMediaStreamDestination();
    
    // Cria nodes de ganho para controle de volume
    const systemGain = audioContext.createGain();
    const micGain = audioContext.createGain();
    
    systemGain.gain.value = 0.7; // Reduz volume do sistema levemente
    micGain.gain.value = 1.0;    // Mantém volume do microfone em 100%
    
    systemSource.connect(systemGain).connect(destination);
    micSource.connect(micGain).connect(destination);

    toast({
      title: "Áudio do sistema ativado",
      description: "A gravação incluirá o áudio do sistema e do microfone. Certifique-se de ter selecionado 'Compartilhar áudio' na janela do Chrome."
    });

    console.log('Configuração do áudio do sistema concluída com sucesso');

    const cleanup = () => {
      displayStream.getTracks().forEach(track => track.stop());
      systemSource.disconnect();
      micSource.disconnect();
      systemGain.disconnect();
      micGain.disconnect();
    };

    return {
      stream: destination.stream,
      cleanup
    };

  } catch (error) {
    console.error('Erro ao configurar áudio do sistema:', error);
    
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        toast({
          variant: "destructive",
          title: "Permissão negada",
          description: "Você precisa permitir o compartilhamento do áudio do sistema e marcar a opção 'Compartilhar áudio' na janela do Chrome."
        });
      } else if (error.message === "Navegador não suporta captação de áudio do sistema") {
        // Já exibimos o toast específico acima
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao capturar áudio",
          description: "Não foi possível configurar a captura do áudio do sistema. Certifique-se de marcar 'Compartilhar áudio' na janela do Chrome."
        });
      }
    }
    throw error;
  }
};