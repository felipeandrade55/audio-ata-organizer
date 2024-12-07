import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { TranscriptionHeader } from "./TranscriptionHeader";
import { TranscriptionActions } from "./TranscriptionActions";
import { TranscriptionMetadata } from "./TranscriptionMetadata";
import TranscriptionTable from "./TranscriptionTable";
import { TranscriptionAnalysisStatus } from "./TranscriptionAnalysisStatus";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { MinutesSection } from "./MinutesSection";
import { MeetingMinutes } from "@/types/meeting";
import { Segment } from "@/types/transcription";
import { analyzeTranscriptionWithAI } from "@/services/aiAnalysisService";
import { AIAnalysisPanel } from "./AIAnalysisPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TranscriptionContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [minutes, setMinutes] = useState<MeetingMinutes | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);

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

    const { segments: initialSegments, minutes: initialMinutes } = location.state;
    if (initialSegments) {
      const convertedSegments: Segment[] = initialSegments.map((segment: any) => ({
        ...segment,
        start: 0,
        end: 0,
      }));
      setSegments(convertedSegments);
    }
    
    if (initialMinutes) {
      console.log("Ata recebida:", initialMinutes);
      setMinutes(initialMinutes);
    }

    // Start AI analysis
    if (initialSegments && initialMinutes) {
      handleAIAnalysis(initialSegments, initialMinutes);
    }
  }, [location.state, navigate, toast]);

  const handleAIAnalysis = async (segments: Segment[], minutes: MeetingMinutes) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeTranscriptionWithAI(segments, minutes);
      if (analysis) {
        setAiAnalysis(analysis);
        toast({
          title: "Análise concluída",
          description: "A análise de IA foi concluída com sucesso.",
        });
      }
    } catch (error) {
      console.error('Error in AI analysis:', error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível completar a análise de IA.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
            <TranscriptionHeader onBack={() => navigate(-1)} />
            
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

            <Tabs defaultValue="transcription" className="mt-6">
              <TabsList>
                <TabsTrigger value="transcription">Transcrição</TabsTrigger>
                <TabsTrigger value="analysis">Análise de IA</TabsTrigger>
                <TabsTrigger value="minutes">Ata</TabsTrigger>
              </TabsList>

              <TabsContent value="transcription">
                <TranscriptionTable
                  segments={segments}
                  onUpdateSegments={setSegments}
                />
              </TabsContent>

              <TabsContent value="analysis">
                <AIAnalysisPanel analysis={aiAnalysis} isLoading={isAnalyzing} />
              </TabsContent>

              <TabsContent value="minutes">
                {minutes && (
                  <MinutesSection minutes={minutes} onMinutesUpdate={setMinutes} />
                )}
              </TabsContent>
            </Tabs>
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