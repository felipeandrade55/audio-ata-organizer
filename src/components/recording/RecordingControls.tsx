import { useState, useEffect } from "react";
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
    
    if (average > -50 && isRecording && !isPaused) {
      toast({
        title: "Aviso de Ruído",
        description: "Foi detectado muito ruído de fundo. Isso pode afetar a qualidade da transcrição.",
        duration: 3000,
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
            disabled={isTranscribing}
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
                onClick={onStopRecording}
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
          className="text-sm text-muted-foreground flex items-center gap-2"
        >
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          Transcrevendo áudio...
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecordingControls;