import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import RecordingTimer from "./RecordingTimer";
import AudioWaveform from "./AudioWaveform";
import { useToast } from "@/hooks/use-toast";
import StartButton from "./StartButton";
import ControlButtons from "./ControlButtons";
import StopRecordingDialog from "./StopRecordingDialog";

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
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isRecording && !isPaused) {
      setupAudioContext();
    } else {
      cleanupAudioContext();
    }

    return () => cleanupAudioContext();
  }, [isRecording, isPaused]);

  const setupAudioContext = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyserNode = context.createAnalyser();
      
      analyserNode.fftSize = 2048;
      source.connect(analyserNode);
      
      setAudioContext(context);
      setAnalyser(analyserNode);
    } catch (error) {
      console.error("Erro ao configurar contexto de áudio:", error);
    }
  };

  const cleanupAudioContext = () => {
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
    setAnalyser(null);
  };

  const handleStopRecording = () => {
    setShowStopConfirmation(true);
  };

  const confirmStopRecording = async () => {
    setShowStopConfirmation(false);
    await onStopRecording();
    toast({
      title: "Transcrição em andamento",
      description: "A gravação foi interrompida e está sendo transcrita. Você já pode iniciar uma nova gravação.",
    });
  };

  return (
    <>
      <StopRecordingDialog 
        open={showStopConfirmation} 
        onOpenChange={setShowStopConfirmation}
        onConfirm={confirmStopRecording}
      />

      <motion.div 
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center w-full gap-4">
          {isRecording && (
            <AudioWaveform
              isRecording={isRecording}
              isPaused={isPaused}
              audioContext={audioContext}
              analyser={analyser}
            />
          )}
          
          <div className="flex items-center gap-4">
            {!isRecording ? (
              <StartButton onStartRecording={onStartRecording} />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <RecordingTimer
                  isRecording={isRecording}
                  isPaused={isPaused}
                  startTime={startTime}
                />
                <ControlButtons 
                  isPaused={isPaused}
                  onStopClick={handleStopRecording}
                  onPauseClick={onPauseRecording}
                  onResumeClick={onResumeRecording}
                />
              </div>
            )}
          </div>
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
    </>
  );
};

export default RecordingControls;