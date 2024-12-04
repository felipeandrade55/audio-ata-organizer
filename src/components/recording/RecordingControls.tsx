import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Pause, Play } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  isTranscribing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
}

const RecordingControls = ({
  isRecording,
  isPaused,
  isTranscribing,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
}: RecordingControlsProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      {isRecording ? (
        <div className="flex gap-2">
          <Button
            size="lg"
            variant="destructive"
            onClick={onStopRecording}
            className="w-full max-w-[120px] transition-all duration-300 hover:scale-105 active:scale-95"
            disabled={isTranscribing}
          >
            <Square className="mr-2 h-5 w-5" />
            Parar
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={isPaused ? onResumeRecording : onPauseRecording}
            className="w-full max-w-[120px] transition-all duration-300 hover:scale-105 active:scale-95"
            disabled={isTranscribing}
          >
            {isPaused ? (
              <>
                <Play className="mr-2 h-5 w-5" />
                Retomar
              </>
            ) : (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pausar
              </>
            )}
          </Button>
        </div>
      ) : (
        <Button
          size="lg"
          variant="default"
          onClick={onStartRecording}
          className={`
            w-full max-w-xs 
            transition-all duration-300
            transform hover:scale-105 active:scale-95
            relative overflow-hidden
            ${isHovered ? 'animate-pulse' : ''}
            before:content-['']
            before:absolute before:top-0 before:left-0
            before:w-full before:h-full
            before:bg-white before:opacity-0
            hover:before:opacity-20
            before:transition-opacity before:duration-300
            shadow-lg hover:shadow-xl
          `}
          disabled={isTranscribing}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Mic className={`
            mr-2 h-5 w-5
            transition-transform duration-300
            ${isHovered ? 'scale-110' : ''}
          `} />
          Iniciar Gravação
        </Button>
      )}

      {isRecording && !isPaused && (
        <div className="text-center text-red-500 animate-pulse">
          Gravando...
        </div>
      )}

      {isRecording && isPaused && (
        <div className="text-center text-yellow-500">
          Gravação pausada
        </div>
      )}

      {isTranscribing && (
        <div className="text-center text-blue-500">
          Transcrevendo o áudio...
        </div>
      )}
    </div>
  );
};

export default RecordingControls;