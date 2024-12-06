import { useState } from "react";
import { MoreVertical, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface KanbanColumnHeaderProps {
  id: string;
  title: string;
  taskCount: number;
  onDelete: () => void;
  onTitleChange: (newTitle: string) => void;
}

export function KanbanColumnHeader({
  id,
  title,
  taskCount,
  onDelete,
  onTitleChange,
}: KanbanColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { toast } = useToast();

  const handleTitleSubmit = async () => {
    try {
      const { error } = await supabase
        .from("kanban_columns")
        .update({ title: newTitle })
        .eq("id", id);

      if (error) throw error;

      onTitleChange(newTitle);
      setIsEditing(false);
      toast({
        title: "Coluna atualizada",
        description: "O nome da coluna foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating column:", error);
      toast({
        title: "Erro ao atualizar coluna",
        description: "Não foi possível atualizar o nome da coluna.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        {isEditing ? (
          <div className="flex gap-2 items-center flex-1">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTitleSubmit();
                } else if (e.key === "Escape") {
                  setIsEditing(false);
                  setNewTitle(title);
                }
              }}
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setNewTitle(title);
              }}
            >
              Cancelar
            </Button>
            <Button size="sm" onClick={handleTitleSubmit}>
              Salvar
            </Button>
          </div>
        ) : (
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {title}
            <Badge variant="secondary" className="ml-2">
              {taskCount}
            </Badge>
          </CardTitle>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              Editar nome
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={onDelete}
            >
              Excluir coluna
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}