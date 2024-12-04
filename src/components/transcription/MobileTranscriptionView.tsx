import { Segment } from "@/types/transcription";
import { EmotionTooltip } from "./EmotionTooltip";
import { TriggerTooltip } from "./TriggerTooltip";

interface MobileTranscriptionViewProps {
  segments: Segment[];
  getEmotionColor: (emotion: { type: string; confidence: number }) => string;
  getTriggerColor: (type: string) => string;
}

export const MobileTranscriptionView = ({ 
  segments, 
  getEmotionColor, 
  getTriggerColor 
}: MobileTranscriptionViewProps) => {
  return (
    <div className="space-y-4">
      {segments.map((segment, index) => (
        <div 
          key={index} 
          className={`rounded-lg p-4 space-y-2 border ${segment.emotion ? getEmotionColor(segment.emotion) : ''}`}
        >
          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">{segment.timestamp}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{segment.speaker}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <p className={`text-sm flex-grow ${segment.triggers?.length ? getTriggerColor(segment.triggers[0].type) : ''}`}>
              {segment.text}
            </p>
            <div className="flex gap-1">
              {segment.emotion && <EmotionTooltip emotion={segment.emotion} />}
              {segment.triggers?.map((trigger, i) => (
                <TriggerTooltip key={i} trigger={trigger} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};