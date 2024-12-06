import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteTranscriptionsDialog } from "./DeleteTranscriptionsDialog";

interface TranscriptionRecord {
  id: string;
  audio_path: string;
  status: string;
  created_at: string;
  error_message?: string;
  retry_count: number;
}

export const RecordingHistory = () => {
  const [recordings, setRecordings] = useState<TranscriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      const { data, error } = await supabase
        .from("transcription_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecordings(data || []);
    } catch (error) {
      console.error("Error fetching recordings:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de gravações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetryTranscription = async (recordingId: string) => {
    toast({
      title: "Processando",
      description: "Iniciando nova tentativa de transcrição...",
    });
    // Implement retry logic here
  };

  const getAudioUrl = (path: string) => {
    return `${supabase.storage.from("meeting_recordings").getPublicUrl(path).data.publicUrl}`;
  };

  const handleSelectAll = () => {
    if (selectedIds.length === recordings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(recordings.map((rec) => rec.id));
    }
  };

  const handleSelectRecording = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Histórico de Gravações
        </CardTitle>
        <div className="flex items-center gap-2">
          {recordings.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="text-sm"
              >
                {selectedIds.length === recordings.length
                  ? "Desmarcar Todos"
                  : "Selecionar Todos"}
              </Button>
              <DeleteTranscriptionsDialog
                selectedIds={selectedIds}
                onDeleteComplete={fetchRecordings}
                onClearSelection={() => setSelectedIds([])}
              />
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recordings.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhuma gravação encontrada.
            </p>
          ) : (
            recordings.map((recording) => (
              <div
                key={recording.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedIds.includes(recording.id)}
                    onCheckedChange={() => handleSelectRecording(recording.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatDistanceToNow(new Date(recording.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          recording.status === "error"
                            ? "bg-red-100 text-red-800"
                            : recording.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {recording.status === "error"
                          ? "Erro"
                          : recording.status === "completed"
                          ? "Concluído"
                          : "Processando"}
                      </span>
                    </div>
                    {recording.error_message && (
                      <p className="text-sm text-red-600 mt-1">
                        {recording.error_message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <audio
                    controls
                    className="h-8"
                    src={getAudioUrl(recording.audio_path)}
                  >
                    Seu navegador não suporta o elemento de áudio.
                  </audio>
                  {recording.status === "error" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRetryTranscription(recording.id)}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};