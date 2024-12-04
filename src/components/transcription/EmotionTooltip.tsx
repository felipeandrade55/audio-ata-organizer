import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Smile } from "lucide-react";

interface EmotionTooltipProps {
  emotion: {
    type: string;
    confidence: number;
  };
}

export const EmotionTooltip = ({ emotion }: EmotionTooltipProps) => {
  const getEmotionTooltip = (emotion: { type: string; confidence: number }) => {
    const confidencePercent = Math.round(emotion.confidence * 100);
    return `Emoção detectada: ${emotion.type} (${confidencePercent}% de confiança)`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Smile className="h-4 w-4 text-red-500 flex-shrink-0" />
        </TooltipTrigger>
        <TooltipContent>
          {getEmotionTooltip(emotion)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};