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

interface DeleteMinutesDialogProps {
  selectedIds: string[];
  onDeleteComplete: () => void;
  onClearSelection: () => void;
}

export const DeleteMinutesDialog = ({
  selectedIds,
  onDeleteComplete,
  onClearSelection,
}: DeleteMinutesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const { error } = await supabase
        .from("meeting_minutes")
        .delete()
        .in("id", selectedIds);

      if (error) throw error;

      toast.success(
        `${selectedIds.length} ${
          selectedIds.length === 1 ? "ata removida" : "atas removidas"
        } com sucesso`
      );
      onDeleteComplete();
      onClearSelection();
    } catch (error) {
      console.error("Erro ao deletar atas:", error);
      toast.error("Erro ao deletar as atas selecionadas");
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
                  ? "1 ata"
                  : `${selectedIds.length} atas`}{" "}
                do histórico.
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