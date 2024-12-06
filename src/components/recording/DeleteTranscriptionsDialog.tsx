import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface DeleteTranscriptionsDialogProps {
  selectedIds: string[];
  onDeleteComplete: () => void;
  onClearSelection: () => void;
}

export const DeleteTranscriptionsDialog = ({
  selectedIds,
  onDeleteComplete,
  onClearSelection,
}: DeleteTranscriptionsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // Primeiro, buscar os caminhos dos arquivos de áudio
      const { data: transcriptions, error: fetchError } = await supabase
        .from("transcription_history")
        .select("audio_path")
        .in("id", selectedIds);

      if (fetchError) throw fetchError;

      // Deletar os arquivos de áudio do storage
      if (transcriptions && transcriptions.length > 0) {
        const filePaths = transcriptions.map(t => t.audio_path);
        const { error: storageError } = await supabase.storage
          .from("meeting_recordings")
          .remove(filePaths);

        if (storageError) {
          console.error("Erro ao deletar arquivos:", storageError);
          toast.error("Erro ao deletar alguns arquivos de áudio");
        }
      }

      // Deletar os registros da tabela transcription_history
      const { error: deleteError } = await supabase
        .from("transcription_history")
        .delete()
        .in("id", selectedIds);

      if (deleteError) throw deleteError;

      toast.success(
        `${selectedIds.length} ${
          selectedIds.length === 1 ? "registro removido" : "registros removidos"
        } com sucesso`
      );
      onDeleteComplete();
      onClearSelection();
    } catch (error) {
      console.error("Erro ao deletar transcrições:", error);
      toast.error("Erro ao deletar as transcrições selecionadas");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={selectedIds.length === 0}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Apagar Selecionados ({selectedIds.length})
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="text-red-600 dark:text-red-400 font-medium">
                Atenção: Esta ação é irreversível!
              </p>
              <p>
                Você está prestes a apagar{" "}
                {selectedIds.length === 1
                  ? "1 registro"
                  : `${selectedIds.length} registros`}{" "}
                do histórico de transcrições e seus arquivos de áudio correspondentes.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Apagando..." : "Sim, apagar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};