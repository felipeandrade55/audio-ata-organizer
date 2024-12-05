import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import TranscriptionHeader from "@/components/transcription/TranscriptionHeader";
import { TranscriptionActions } from "@/components/transcription/TranscriptionActions";
import { TranscriptionMetadata } from "@/components/transcription/TranscriptionMetadata";
import TranscriptionTable from "@/components/transcription/TranscriptionTable";
import { TranscriptionAnalysisStatus } from "@/components/transcription/TranscriptionAnalysisStatus";
import MeetingMinutesDisplay from "@/components/meeting/MeetingMinutesDisplay";
import MeetingMinutesEdit from "@/components/meeting/MeetingMinutesEdit";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { MeetingMinutes } from "@/types/meeting";
import { Edit2 } from "lucide-react";
import { analyzeTranscription } from "@/services/aiAnalysisService";
import { motion, AnimatePresence } from "framer-motion";
import { exportToFormat } from "@/utils/exportUtils";

const TranscriptionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMinutes, setCurrentMinutes] = useState<MeetingMinutes | null>(null);
  const [versions, setVersions] = useState<Array<{
    id: string;
    date: string;
    author: string;
    changes: string;
    minutes: MeetingMinutes;
  }>>([]);
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

    const { segments: initialSegments, date } = location.state;
    setSegments(initialSegments);

    const autoAnalyzeTranscription = async () => {
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        toast({
          title: "Chave da API necessária",
          description: "Por favor, configure sua chave da API OpenAI nas configurações.",
          variant: "destructive",
        });
        return;
      }

      setIsAnalyzing(true);
      try {
        const transcriptionText = segments
          .map((s) => `${s.speaker}: ${s.text}`)
          .join("\n");

        const analyzedMinutes = await analyzeTranscription(transcriptionText, apiKey);
        
        if (analyzedMinutes) {
          setCurrentMinutes(analyzedMinutes);
          toast({
            title: "ATA Pronta! 🎉",
            description: "A ata foi preenchida automaticamente com base na transcrição.",
            duration: 5000,
          });
        }
      } catch (error) {
        toast({
          title: "Erro na análise",
          description: "Não foi possível analisar a transcrição.",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    };

    autoAnalyzeTranscription();
  }, [location.state, navigate, toast]);

  const handleSave = (updatedMinutes: MeetingMinutes) => {
    const newVersion = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('pt-BR'),
      author: updatedMinutes.author || 'Sistema',
      changes: 'Atualização da ata',
      minutes: updatedMinutes
    };

    setVersions(prev => [newVersion, ...prev]);
    setCurrentMinutes(updatedMinutes);
    setIsEditing(false);

    toast({
      title: "Ata atualizada",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  if (!location.state || !currentMinutes) {
    return null;
  }

  const { date } = location.state;

  const [comments] = useState([
    {
      id: "1",
      author: "Sistema",
      date: "2024-03-14 10:00",
      content: "ATA gerada automaticamente pelo sistema",
    },
  ]);

  const [approvers] = useState([
    {
      name: "João Silva",
      role: "Gerente",
      status: "pending" as const,
    },
  ]);

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
              versions={versions}
              comments={comments}
              approvers={approvers}
              onRestoreVersion={(version) => {
                setCurrentMinutes(version.minutes);
                toast({
                  title: "Versão restaurada",
                  description: `A versão de ${version.date} foi restaurada com sucesso.`,
                });
              }}
              onAddComment={() => {}}
              onApprove={() => {}}
              onReject={() => {}}
              onShareEmail={() => {}}
              onAddToCalendar={() => {}}
            />

            <div className="flex justify-end gap-2 mb-4">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                {isEditing ? "Cancelar Edição" : "Editar Ata"}
              </Button>
            </div>
            
            <AnimatePresence>
              {isEditing ? (
                <MeetingMinutesEdit
                  minutes={currentMinutes}
                  onSave={handleSave}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <MeetingMinutesDisplay minutes={currentMinutes} />
              )}
            </AnimatePresence>

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

export default TranscriptionDetail;
