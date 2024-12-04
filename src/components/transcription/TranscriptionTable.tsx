import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, Smile } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip } from "@/components/ui/tooltip";

interface Segment {
  speaker: string;
  text: string;
  timestamp: string;
  emotion?: {
    type: string;
    confidence: number;
  };
}

interface TranscriptionTableProps {
  segments: Segment[];
  onUpdateSegments: (segments: Segment[]) => void;
}

const TranscriptionTable = ({ segments, onUpdateSegments }: TranscriptionTableProps) => {
  const [editingSpeaker, setEditingSpeaker] = useState<number | null>(null);
  const [newSpeakerName, setNewSpeakerName] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleEditSpeaker = (index: number, currentName: string) => {
    setEditingSpeaker(index);
    setNewSpeakerName(currentName);
  };

  const handleSaveSpeaker = (index: number) => {
    const updatedSegments = segments.map((segment, i) => {
      if (i === index) {
        return { ...segment, speaker: newSpeakerName };
      }
      return segment;
    });
    onUpdateSegments(updatedSegments);
    setEditingSpeaker(null);
    setNewSpeakerName("");
    
    toast({
      title: "Nome atualizado",
      description: "O nome do participante foi atualizado com sucesso.",
    });
  };

  const getEmotionColor = (emotion?: { type: string; confidence: number }) => {
    if (!emotion) return "";
    return "bg-red-100 dark:bg-red-900/30";
  };

  const getEmotionTooltip = (emotion?: { type: string; confidence: number }) => {
    if (!emotion) return "";
    return `Emoção detectada: ${emotion.type} (Confiança: ${Math.round(emotion.confidence * 100)}%)`;
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {segments.map((segment, index) => (
          <div 
            key={index} 
            className={`rounded-lg p-4 space-y-2 border ${getEmotionColor(segment.emotion)}`}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">{segment.timestamp}</span>
              {editingSpeaker === index ? (
                <div className="flex items-center gap-2 flex-1 ml-2">
                  <Input
                    value={newSpeakerName}
                    onChange={(e) => setNewSpeakerName(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSaveSpeaker(index)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{segment.speaker}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditSpeaker(index, segment.speaker)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-start gap-2">
              <p className="text-sm flex-grow">{segment.text}</p>
              {segment.emotion && (
                <Tooltip content={getEmotionTooltip(segment.emotion)}>
                  <Smile className="h-4 w-4 text-red-500 flex-shrink-0" />
                </Tooltip>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

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
              className={getEmotionColor(segment.emotion)}
            >
              <TableCell className="whitespace-nowrap">{segment.timestamp}</TableCell>
              <TableCell>
                {editingSpeaker === index ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newSpeakerName}
                      onChange={(e) => setNewSpeakerName(e.target.value)}
                      className="w-full min-w-[100px]"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSaveSpeaker(index)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <span className="whitespace-nowrap">{segment.speaker}</span>
                )}
              </TableCell>
              <TableCell className="max-w-[300px] sm:max-w-none">
                <div className="break-words flex items-start gap-2">
                  <span>{segment.text}</span>
                  {segment.emotion && (
                    <Tooltip content={getEmotionTooltip(segment.emotion)}>
                      <Smile className="h-4 w-4 text-red-500 flex-shrink-0" />
                    </Tooltip>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {editingSpeaker !== index && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditSpeaker(index, segment.speaker)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TranscriptionTable;