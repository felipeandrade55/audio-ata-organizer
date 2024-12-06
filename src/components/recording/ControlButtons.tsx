import { Button } from "@/components/ui/button";
import { Square, Pause, Play } from "lucide-react";

interface ControlButtonsProps {
  isPaused: boolean;
  onStopClick: () => void;
  onPauseClick: () => void;
  onResumeClick: () => void;
}

const ControlButtons = ({ 
  isPaused, 
  onStopClick, 
  onPauseClick, 
  onResumeClick 
}: ControlButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onStopClick}
        variant="destructive"
        className="shadow-lg hover:shadow-xl transition-all duration-300"
        size="lg"
      >
        <Square className="w-5 h-5 mr-2" />
        Parar
      </Button>
      
      <Button
        onClick={isPaused ? onResumeClick : onPauseClick}
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
  );
};

export default ControlButtons;