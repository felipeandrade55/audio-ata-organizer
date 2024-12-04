import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface Segment {
  speaker: string;
  text: string;
  timestamp: string;
}

interface TranscriptionTableProps {
  segments: Segment[];
  onUpdateSegments: (segments: Segment[]) => void;
}

const TranscriptionTable = ({ segments, onUpdateSegments }: TranscriptionTableProps) => {
  const [editingSpeaker, setEditingSpeaker] = useState<number | null>(null);
  const [newSpeakerName, setNewSpeakerName] = useState("");
  const { toast } = useToast();

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Horário</TableHead>
          <TableHead>Participante</TableHead>
          <TableHead className="w-full">Fala</TableHead>
          <TableHead className="w-[100px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {segments.map((segment, index) => (
          <TableRow key={index}>
            <TableCell>{segment.timestamp}</TableCell>
            <TableCell>
              {editingSpeaker === index ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newSpeakerName}
                    onChange={(e) => setNewSpeakerName(e.target.value)}
                    className="w-[150px]"
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
                segment.speaker
              )}
            </TableCell>
            <TableCell>{segment.text}</TableCell>
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
  );
};

export default TranscriptionTable;