import { Segment } from "@/types/transcription";
import { EmotionTooltip } from "./EmotionTooltip";
import { TriggerTooltip } from "./TriggerTooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DesktopTranscriptionViewProps {
  segments: Segment[];
  getEmotionColor: (emotion: { type: string; confidence: number }) => string;
  getTriggerColor: (type: string) => string;
}

export const DesktopTranscriptionView = ({ 
  segments, 
  getEmotionColor, 
  getTriggerColor 
}: DesktopTranscriptionViewProps) => {
  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24 sm:w-32">Horário</TableHead>
            <TableHead className="w-32 sm:w-40">Participante</TableHead>
            <TableHead className="min-w-[200px]">Fala</TableHead>
            <TableHead className="w-16 sm:w-20">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {segments.map((segment, index) => (
            <TableRow 
              key={index}
              className={segment.emotion ? getEmotionColor(segment.emotion) : ''}
            >
              <TableCell className="whitespace-nowrap">{segment.timestamp}</TableCell>
              <TableCell>
                <span className="whitespace-nowrap">{segment.speaker}</span>
              </TableCell>
              <TableCell className="max-w-[300px] sm:max-w-none">
                <div className="break-words flex items-start gap-2">
                  <span className={segment.triggers?.length ? getTriggerColor(segment.triggers[0].type) : ''}>
                    {segment.text}
                  </span>
                  <div className="flex gap-1">
                    {segment.emotion && <EmotionTooltip emotion={segment.emotion} />}
                    {segment.triggers?.map((trigger, i) => (
                      <TriggerTooltip key={i} trigger={trigger} />
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {/* ... Ações dos segmentos se necessário */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};