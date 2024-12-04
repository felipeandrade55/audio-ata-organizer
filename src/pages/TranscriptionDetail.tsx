import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import TranscriptionHeader from "@/components/transcription/TranscriptionHeader";
import TranscriptionTable from "@/components/transcription/TranscriptionTable";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface Segment {
  speaker: string;
  text: string;
  timestamp: string;
}

const TranscriptionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!location.state) {
      toast({
        title: "Erro",
        description: "Nenhuma transcrição encontrada. Redirecionando para a página inicial.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
  }, [location.state, navigate, toast]);

  if (!location.state) {
    return null;
  }

  const { segments: initialSegments, date } = location.state;
  const [segments, setSegments] = useState<Segment[]>(initialSegments);

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
    <div className={`container mx-auto p-2 sm:p-4 ${isMobile ? 'max-w-full' : 'max-w-4xl'}`}>
      <Card className="overflow-hidden">
        <CardContent className="p-2 sm:p-6">
          <TranscriptionHeader
            date={date}
            onExportTxt={exportToTxt}
            onExportPdf={exportToPdf}
            onExportExcel={exportToExcel}
            onBack={() => navigate(-1)}
          />
          <div className="mt-4 sm:mt-6 overflow-x-auto">
            <TranscriptionTable
              segments={segments}
              onUpdateSegments={setSegments}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranscriptionDetail;