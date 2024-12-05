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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

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
    <Card className="border rounded-lg shadow-sm">
      <ScrollArea className="h-[600px] rounded-md">
        <div className="p-4">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-24 sm:w-32 font-semibold">Horário</TableHead>
                <TableHead className="w-32 sm:w-40 font-semibold">Participante</TableHead>
                <TableHead className="min-w-[200px] font-semibold">Fala</TableHead>
                <TableHead className="w-16 sm:w-20 font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((segment, index) => (
                <TableRow 
                  key={index}
                  className={`transition-colors hover:bg-muted/50 ${segment.emotion ? getEmotionColor(segment.emotion) : ''}`}
                >
                  <TableCell className="whitespace-nowrap font-medium">{segment.timestamp}</TableCell>
                  <TableCell>
                    <span className="whitespace-nowrap font-medium">{segment.speaker}</span>
                  </TableCell>
                  <TableCell className="max-w-[300px] sm:max-w-none">
                    <div className="break-words flex items-start gap-2">
                      <span className={`flex-grow ${segment.triggers?.length ? getTriggerColor(segment.triggers[0].type) : ''}`}>
                        {segment.text}
                      </span>
                      <div className="flex gap-1 flex-shrink-0">
                        {segment.emotion && <EmotionTooltip emotion={segment.emotion} />}
                        {segment.triggers?.map((trigger, i) => (
                          <TriggerTooltip key={i} trigger={trigger} />
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* Ações dos segmentos se necessário */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </Card>
  );
};
