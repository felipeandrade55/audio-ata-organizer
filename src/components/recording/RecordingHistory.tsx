import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { DeleteTranscriptionsDialog } from "./DeleteTranscriptionsDialog";
import { RecordingCard } from "./RecordingCard";
import { TranscriptionRecord } from "./types";

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
  };

  const handleShareRecording = async (recordingId: string) => {
    // Implementar lógica de compartilhamento
    toast({
      title: "Compartilhar",
      description: "Funcionalidade de compartilhamento em desenvolvimento.",
    });
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
              <RecordingCard
                key={recording.id}
                recording={recording}
                onRetry={handleRetryTranscription}
                onShare={handleShareRecording}
                isSelected={selectedIds.includes(recording.id)}
                onSelect={handleSelectRecording}
                getAudioUrl={getAudioUrl}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
