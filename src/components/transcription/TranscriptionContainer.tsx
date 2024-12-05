import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import TranscriptionHeader from "./TranscriptionHeader";
import { TranscriptionActions } from "./TranscriptionActions";
import { TranscriptionMetadata } from "./TranscriptionMetadata";
import TranscriptionTable from "./TranscriptionTable";
import { TranscriptionAnalysisStatus } from "./TranscriptionAnalysisStatus";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { exportToFormat } from "@/utils/exportUtils";
import { MinutesSection } from "./MinutesSection";

const TranscriptionContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [segments, setSegments] = useState<Array<{
    timestamp: string;
    speaker: string;
    text: string;
  }>>([]);

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

    const { segments: initialSegments } = location.state;
    setSegments(initialSegments);
  }, [location.state, navigate, toast]);

  const handleExportTxt = () => {
    const { segments, date } = location.state;
    exportToFormat(segments, date, 'txt');
  };

  const handleExportPdf = () => {
    const { segments, date } = location.state;
    exportToFormat(segments, date, 'pdf');
  };

  const handleExportExcel = () => {
    const { segments, date } = location.state;
    exportToFormat(segments, date, 'excel');
  };

  if (!location.state) {
    return null;
  }

  const { date } = location.state;

  return (
    <div className="min-h-screen bg-background">
      <div className={`container mx-auto px-2 py-4 sm:px-4 sm:py-6 ${isMobile ? 'max-w-full' : 'max-w-7xl'}`}>
        <Card className="overflow-hidden">
          <CardContent className="p-2 sm:p-6">
            <TranscriptionHeader
              date={date}
              onBack={() => navigate(-1)}
              onExportTxt={handleExportTxt}
              onExportPdf={handleExportPdf}
              onExportExcel={handleExportExcel}
            />
            
            <TranscriptionActions date={date} segments={segments} />
            
            <TranscriptionMetadata
              versions={[]}
              comments={[{
                id: "1",
                author: "Sistema",
                date: "2024-03-14 10:00",
                content: "ATA gerada automaticamente pelo sistema",
              }]}
              approvers={[{
                name: "João Silva",
                role: "Gerente",
                status: "pending" as const,
              }]}
              onRestoreVersion={() => {}}
              onAddComment={() => {}}
              onApprove={() => {}}
              onReject={() => {}}
              onShareEmail={() => {}}
              onAddToCalendar={() => {}}
            />

            <MinutesSection />

            <div className="mt-6">
              <TranscriptionTable
                segments={segments}
                onUpdateSegments={setSegments}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <AnimatePresence>
        <TranscriptionAnalysisStatus isAnalyzing={isAnalyzing} />
      </AnimatePresence>
    </div>
  );
};

export default TranscriptionContainer;