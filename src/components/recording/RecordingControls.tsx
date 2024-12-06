import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Pause, Play } from "lucide-react";
import { motion } from "framer-motion";
import RecordingTimer from "./RecordingTimer";
import { useToast } from "@/hooks/use-toast";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  isTranscribing: boolean;
  startTime: number | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
}

const RecordingControls = ({
  isRecording,
  isPaused,
  isTranscribing,
  startTime,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
}: RecordingControlsProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [noiseCheckInterval, setNoiseCheckInterval] = useState<number | null>(null);
  const lastNoiseAlertRef = useRef<number>(0);
  const NOISE_ALERT_COOLDOWN = 10000; // 10 segundos entre alertas
  const { toast } = useToast();

  useEffect(() => {
    if (isRecording && !isPaused) {
      setupNoiseDetection();
    } else {
      cleanupNoiseDetection();
    }

    return () => cleanupNoiseDetection();
  }, [isRecording, isPaused]);

  const setupNoiseDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyserNode = context.createAnalyser();
      
      analyserNode.fftSize = 2048;
      source.connect(analyserNode);
      
      setAudioContext(context);
      setAnalyser(analyserNode);

      const intervalId = window.setInterval(() => {
        if (isRecording && !isPaused) {
          checkNoiseLevel(analyserNode);
        }
      }, 2000);

      setNoiseCheckInterval(intervalId);
    } catch (error) {
      console.error("Erro ao configurar detecção de ruído:", error);
    }
  };

  const checkNoiseLevel = (analyserNode: AnalyserNode) => {
    const dataArray = new Float32Array(analyserNode.frequencyBinCount);
    analyserNode.getFloatFrequencyData(dataArray);

    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const now = Date.now();
    
    if (average > -50 && isRecording && !isPaused && now - lastNoiseAlertRef.current > NOISE_ALERT_COOLDOWN) {
      lastNoiseAlertRef.current = now;
      toast({
        title: "Dica para melhor qualidade",
        description: "Detectamos alguns ruídos de fundo. Para uma transcrição mais precisa, que tal procurar um ambiente mais silencioso? 🎯",
        duration: 5000,
      });
    }
  };

  const cleanupNoiseDetection = () => {
    if (noiseCheckInterval) {
      clearInterval(noiseCheckInterval);
      setNoiseCheckInterval(null);
    }
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
    setAnalyser(null);
  };

  const handleStopRecording = async () => {
    await onStopRecording();
    toast({
      title: "Transcrição em andamento",
      description: "A gravação foi interrompida e está sendo transcrita. Você já pode iniciar uma nova gravação.",
    });
  };

  return (
    <motion.div 
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <Button
            onClick={onStartRecording}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Mic className="w-5 h-5" />
              <span>Iniciar Gravação</span>
            </motion.div>
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <RecordingTimer
              isRecording={isRecording}
              isPaused={isPaused}
              startTime={startTime}
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={handleStopRecording}
                variant="destructive"
                className="shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Square className="w-5 h-5 mr-2" />
                Parar
              </Button>
              
              <Button
                onClick={isPaused ? onResumeRecording : onPauseRecording}
                variant="outline"
                className="shadow-md hover:shadow-lg transition-all duration-300"
                size="lg"
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Retomar
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pausar
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {isTranscribing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          <span>Transcrevendo áudio e gerando ATA com I.A...</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecordingControls;