import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

type ExportFormat = 'txt' | 'pdf' | 'excel';

interface TranscriptionSegment {
  timestamp: string;
  speaker: string;
  text: string;
}

export const exportToFormat = (segments: TranscriptionSegment[], date: string, format: ExportFormat) => {
  switch (format) {
    case 'txt':
      exportToTxt(segments, date);
      break;
    case 'pdf':
      exportToPdf(segments, date);
      break;
    case 'excel':
      exportToExcel(segments, date);
      break;
  }
};

const exportToTxt = (segments: TranscriptionSegment[], date: string) => {
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

const exportToPdf = (segments: TranscriptionSegment[], date: string) => {
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

const exportToExcel = (segments: TranscriptionSegment[], date: string) => {
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