import { useIsMobile } from "@/hooks/use-mobile";
import { Segment } from "@/types/transcription";
import { MobileTranscriptionView } from "./MobileTranscriptionView";
import { DesktopTranscriptionView } from "./DesktopTranscriptionView";
import { getEmotionColor, getTriggerColor } from "./utils/colorUtils";

interface TranscriptionTableProps {
  segments: Segment[];
  onUpdateSegments: (segments: Segment[]) => void;
}

const TranscriptionTable = ({ segments, onUpdateSegments }: TranscriptionTableProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileTranscriptionView 
        segments={segments}
        getEmotionColor={getEmotionColor}
        getTriggerColor={getTriggerColor}
      />
    );
  }

  return (
    <DesktopTranscriptionView 
      segments={segments}
      getEmotionColor={getEmotionColor}
      getTriggerColor={getTriggerColor}
    />
  );
};

export default TranscriptionTable;