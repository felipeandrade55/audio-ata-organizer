import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Download, Edit2, Save } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

interface Segment {
  speaker: string;
  text: string;
  timestamp: string;
}

const TranscriptionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { segments: initialSegments, date } = location.state;
  
  const [segments, setSegments] = useState<Segment[]>(initialSegments);
  const [editingSpeaker, setEditingSpeaker] = useState<number | null>(null);
  const [newSpeakerName, setNewSpeakerName] = useState("");

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
    setSegments(updatedSegments);
    setEditingSpeaker(null);
    setNewSpeakerName("");
    
    toast({
      title: "Nome atualizado",
      description: "O nome do participante foi atualizado com sucesso.",
    });
  };

  const exportToTxt = () => {
    const text = segments
      .map((s) => `[${s.timestamp}] ${s.speaker}: ${s.text}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ata-reuniao-${date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text(`Ata de Reunião - ${date}`, 20, 20);
    
    doc.setFontSize(12);
    let yPosition = 40;
    
    segments.forEach((segment) => {
      const text = `${segment.timestamp} - ${segment.speaker}: ${segment.text}`;
      const splitText = doc.splitTextToSize(text, 170);
      
      if (yPosition + 10 * splitText.length > 280) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(splitText, 20, yPosition);
      yPosition += 10 * splitText.length + 5;
    });
    
    doc.save(`ata-reuniao-${date}.pdf`);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      segments.map((s) => ({
        Horário: s.timestamp,
        Participante: s.speaker,
        Fala: s.text,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ata");
    XLSX.writeFile(wb, `ata-reuniao-${date}.xlsx`);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
            <CardTitle>Ata de Reunião - {date}</CardTitle>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToTxt}>
                Exportar como TXT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPdf}>
                Exportar como PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                Exportar como Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default TranscriptionDetail;