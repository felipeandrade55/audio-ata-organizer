import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AudioReanalysisDialogProps {
  meetingId: string;
  onAnalysisComplete: () => void;
}

export const AudioReanalysisDialog = ({ meetingId, onAnalysisComplete }: AudioReanalysisDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Upload to Supabase Storage
      const fileName = `reanalysis_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('meeting_recordings')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Start reanalysis
      setIsAnalyzing(true);
      const { data, error } = await supabase.functions.invoke('reanalyze-audio', {
        body: {
          meetingId,
          audioPath: uploadData.path
        }
      });

      if (error) throw error;

      toast({
        title: "Análise concluída",
        description: "A ata foi atualizada com sucesso.",
      });

      onAnalysisComplete();
    } catch (error) {
      console.error('Error in audio reanalysis:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o áudio. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Reanalisar Áudio
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reanalisar Áudio da Reunião</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Selecione um arquivo de áudio para reanalisar e atualizar a ata da reunião.
            O processo pode levar alguns minutos.
          </p>
          <div className="space-y-2">
            <Input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={isUploading || isAnalyzing}
            />
            {(isUploading || isAnalyzing) && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  {isUploading ? "Enviando arquivo..." : "Analisando áudio..."}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};