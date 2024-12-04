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
  return (
    <div className="flex flex-col items-center gap-4">
      {isRecording ? (
        <div className="flex gap-2">
          <Button
            size="lg"
            variant="destructive"
            onClick={onStopRecording}
            className="w-full max-w-[120px]"
            disabled={isTranscribing}
          >
            <Square className="mr-2 h-5 w-5" />
            Parar
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={isPaused ? onResumeRecording : onPauseRecording}
            className="w-full max-w-[120px]"
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
          className="w-full max-w-xs"
          disabled={isTranscribing}
        >
          <Mic className="mr-2 h-5 w-5" />
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