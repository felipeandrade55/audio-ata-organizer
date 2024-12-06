import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Task, Column } from "./types";
import { KanbanColumn } from "./KanbanColumn";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface KanbanBoardProps {
  userId: string;
}

export function KanbanBoard({ userId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch columns
      const { data: columnsData, error: columnsError } = await supabase
        .from("kanban_columns")
        .select("*")
        .order("order_index", { ascending: true });

      if (columnsError) throw columnsError;

      // If no columns exist, create default columns
      if (!columnsData || columnsData.length === 0) {
        const defaultColumns = [
          { title: "A Fazer", column_type: "todo" },
          { title: "Em Progresso", column_type: "in_progress" },
          { title: "Revisão", column_type: "review" },
          { title: "Concluído", column_type: "done" },
        ];

        const { data: createdColumns, error: createError } = await supabase
          .from("kanban_columns")
          .insert(
            defaultColumns.map((col, index) => ({
              title: col.title,
              column_type: col.column_type,
              order_index: index,
              user_id: userId,
            }))
          )
          .select();

        if (createError) throw createError;
        setColumns(createdColumns);
      } else {
        setColumns(columnsData);
      }

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from("kanban_tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar suas tarefas e colunas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateColumn = async () => {
    if (!newColumnTitle.trim()) return;

    try {
      const { data, error } = await supabase
        .from("kanban_columns")
        .insert({
          title: newColumnTitle,
          user_id: userId,
          order_index: columns.length,
          column_type: "custom",
        })
        .select()
        .single();

      if (error) throw error;

      setColumns([...columns, data]);
      setNewColumnTitle("");
      setIsDialogOpen(false);
      toast({
        title: "Coluna criada",
        description: "A coluna foi criada com sucesso.",
      });
    } catch (error) {
      console.error("Error creating column:", error);
      toast({
        title: "Erro ao criar coluna",
        description: "Não foi possível criar a coluna.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    try {
      const { error } = await supabase
        .from("kanban_columns")
        .delete()
        .eq("id", columnId);

      if (error) throw error;

      setColumns(columns.filter((col) => col.id !== columnId));
      setTasks(tasks.filter((task) => task.status !== columnId));
      toast({
        title: "Coluna excluída",
        description: "A coluna foi excluída com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting column:", error);
      toast({
        title: "Erro ao excluir coluna",
        description: "Não foi possível excluir a coluna.",
        variant: "destructive",
      });
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const newTasks = Array.from(tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);
      setTasks(newTasks);
    } else {
      // Moving to a different column
      try {
        const { error } = await supabase
          .from("kanban_tasks")
          .update({ status: destination.droppableId })
          .eq("id", draggableId);

        if (error) throw error;

        const newTasks = tasks.map((task) =>
          task.id === draggableId
            ? { ...task, status: destination.droppableId }
            : task
        );
        setTasks(newTasks);

        toast({
          title: "Tarefa atualizada",
          description: "Status da tarefa atualizado com sucesso.",
        });
      } catch (error) {
        console.error("Error updating task status:", error);
        toast({
          title: "Erro ao atualizar tarefa",
          description: "Não foi possível atualizar o status da tarefa.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return <div>Carregando tarefas...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Coluna
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Coluna</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Digite o título da coluna"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateColumn();
                  }
                }}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setNewColumnTitle("");
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateColumn}>Criar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.status === column.id)}
              onDelete={() => handleDeleteColumn(column.id)}
              onTitleChange={(newTitle) => {
                setColumns(
                  columns.map((col) =>
                    col.id === column.id ? { ...col, title: newTitle } : col
                  )
                );
              }}
              onTaskCreate={(task) => setTasks([task, ...tasks])}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}