import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import TranscriptionHeader from "@/components/transcription/TranscriptionHeader";
import TranscriptionTable from "@/components/transcription/TranscriptionTable";
import { TranscriptionAnalysisStatus } from "@/components/transcription/TranscriptionAnalysisStatus";
import MeetingMinutesDisplay from "@/components/meeting/MeetingMinutesDisplay";
import MeetingMinutesEdit from "@/components/meeting/MeetingMinutesEdit";
import MeetingVersionHistory from "@/components/meeting/MeetingVersionHistory";
import MeetingComments from "@/components/meeting/MeetingComments";
import MeetingApprovalWorkflow from "@/components/meeting/MeetingApprovalWorkflow";
import MeetingSharing from "@/components/meeting/MeetingSharing";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { MeetingMinutes } from "@/types/meeting";
import { Edit2 } from "lucide-react";
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { analyzeTranscription } from "@/services/aiAnalysisService";
import { motion, AnimatePresence } from "framer-motion";

const TranscriptionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  if (!location.state) {
    return null;
  }

  const { segments: initialSegments, date } = location.state;
  const [segments, setSegments] = useState(initialSegments);

  const meetingMinutes: MeetingMinutes = {
    date: date,
    startTime: segments[0]?.timestamp || "00:00",
    endTime: segments[segments.length - 1]?.timestamp || "00:00",
    location: "Virtual - Gravação de Áudio",
    meetingTitle: "Reunião Transcrita",
    organizer: "Sistema de Transcrição",
    participants: Array.from(new Set(segments.map(s => s.speaker))).map(name => ({
      name: String(name),
    })),
    agendaItems: [{
      title: "Transcrição Automática",
      discussion: segments.map(s => `${s.speaker}: ${s.text}`).join("\n"),
    }],
    actionItems: [],
    summary: "Transcrição automática de áudio realizada pelo sistema.",
    nextSteps: [],
    author: "Sistema de Transcrição Automática",
  };

  const [currentMinutes, setCurrentMinutes] = useState<MeetingMinutes>(meetingMinutes);

  const [versions, setVersions] = useState<Array<{
    id: string;
    date: string;
    author: string;
    changes: string;
    minutes: MeetingMinutes;
  }>>([]);

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

  const handleRestoreVersion = (version: typeof versions[0]) => {
    setCurrentMinutes(version.minutes);
    toast({
      title: "Versão restaurada",
      description: `A versão de ${version.date} foi restaurada com sucesso.`,
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

  const handleAddComment = (content: string) => {
    // Implementar lógica de adicionar comentário
  };

  const handleApprove = () => {
    // Implementar lógica de aprovação
  };

  const handleReject = () => {
    // Implementar lógica de rejeição
  };

  const handleShareEmail = (email: string) => {
    // Implementar lógica de compartilhamento por email
  };

  const handleAddToCalendar = () => {
    // Implementar lógica de adicionar ao calendário
  };

  return (
    <div className="min-h-screen bg-background">
      <div className={`container mx-auto px-2 py-4 sm:px-4 sm:py-6 ${isMobile ? 'max-w-full' : 'max-w-7xl'}`}>
        <Card className="overflow-hidden">
          <CardContent className="p-2 sm:p-6">
            <TranscriptionHeader
              date={date}
              onExportTxt={exportToTxt}
              onExportPdf={exportToPdf}
              onExportExcel={exportToExcel}
              onBack={() => navigate(-1)}
            />
            
            <div className="mt-4 sm:mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <MeetingVersionHistory 
                  versions={versions.map(v => ({
                    id: v.id,
                    date: v.date,
                    author: v.author,
                    changes: v.changes
                  }))}
                  onRestore={handleRestoreVersion}
                />
                <MeetingComments
                  comments={comments}
                  onAddComment={handleAddComment}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <MeetingApprovalWorkflow
                  approvers={approvers}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
                <MeetingSharing
                  meetingId="123"
                  onShareEmail={handleShareEmail}
                  onAddToCalendar={handleAddToCalendar}
                />
              </div>

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
