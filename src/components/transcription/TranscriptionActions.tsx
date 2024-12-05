import { Button } from "@/components/ui/button";
import { exportToFormat } from "@/utils/exportUtils";

interface TranscriptionActionsProps {
  date: string;
  segments: Array<{
    timestamp: string;
    speaker: string;
    text: string;
  }>;
}

export const TranscriptionActions = ({ date, segments }: TranscriptionActionsProps) => {
  const exportToTxt = () => exportToFormat(segments, date, 'txt');
  const exportToPdf = () => exportToFormat(segments, date, 'pdf');
  const exportToExcel = () => exportToFormat(segments, date, 'excel');

  return (
    <div className="flex gap-2 mb-4">
      <Button variant="outline" onClick={exportToTxt}>
        Exportar TXT
      </Button>
      <Button variant="outline" onClick={exportToPdf}>
        Exportar PDF
      </Button>
      <Button variant="outline" onClick={exportToExcel}>
        Exportar Excel
      </Button>
    </div>
  );
};