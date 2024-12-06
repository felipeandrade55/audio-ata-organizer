import { toast } from "sonner";

interface AudioStreamResult {
  stream: MediaStream;
  cleanup?: () => void;
}

export const setupSystemAudio = async (
  micStream: MediaStream,
  audioContext: AudioContext
): Promise<AudioStreamResult> => {
  try {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false
    });

    const micSource = audioContext.createMediaStreamSource(micStream);
    const systemSource = audioContext.createMediaStreamSource(displayStream);
    const destination = audioContext.createMediaStreamDestination();

    const micGain = audioContext.createGain();
    const systemGain = audioContext.createGain();

    micGain.gain.value = 0.7;
    systemGain.gain.value = 0.3;

    micSource.connect(micGain).connect(destination);
    systemSource.connect(systemGain).connect(destination);

    toast({
      title: "Áudio do Sistema",
      description: "Áudio do sistema capturado com sucesso!",
      duration: 3000,
    });

    return {
      stream: destination.stream,
      cleanup: () => {
        displayStream.getTracks().forEach(track => track.stop());
        micGain.disconnect();
        systemGain.disconnect();
      }
    };
  } catch (error) {
    console.error('Erro ao capturar áudio do sistema:', error);
    toast({
      title: "Aviso",
      description: "Não foi possível capturar o áudio do sistema. Apenas o microfone será gravado.",
      duration: 5000,
    });
    return { stream: micStream };
  }
};