import { toast } from "@/hooks/use-toast";

interface AudioStreamResult {
  stream: MediaStream;
  cleanup?: () => void;
}

export const setupSystemAudio = async (micStream: MediaStream, audioContext: AudioContext): Promise<AudioStreamResult> => {
  try {
    // @ts-ignore - TypeScript doesn't recognize getDisplayMedia yet
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
      video: false
    });

    const systemSource = audioContext.createMediaStreamSource(displayStream);
    const micSource = audioContext.createMediaStreamSource(micStream);
    
    const destination = audioContext.createMediaStreamDestination();
    
    // Create gain nodes for volume control
    const systemGain = audioContext.createGain();
    const micGain = audioContext.createGain();
    
    systemGain.gain.value = 0.7; // Reduce system audio volume slightly
    micGain.gain.value = 1.0;    // Keep mic volume at 100%
    
    systemSource.connect(systemGain).connect(destination);
    micSource.connect(micGain).connect(destination);

    toast({
      title: "Áudio do sistema ativado",
      description: "A gravação incluirá o áudio do sistema e do microfone."
    });

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
    if (error instanceof Error && error.name === 'NotAllowedError') {
      toast({
        variant: "destructive",
        title: "Permissão negada",
        description: "Você precisa permitir o compartilhamento do áudio do sistema."
      });
    }
    throw error;
  }
};