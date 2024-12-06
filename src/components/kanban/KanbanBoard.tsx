import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Task, Column } from "./types";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  userId: string;
}

const defaultColumns: Column[] = [
  { id: "todo", title: "A Fazer" },
  { id: "in_progress", title: "Em Progresso" },
  { id: "review", title: "Revisão" },
  { id: "done", title: "Concluído" },
];

export function KanbanBoard({ userId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("kanban_tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Erro ao carregar tarefas",
        description: "Não foi possível carregar suas tarefas. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

        const newTasks = tasks.map(task =>
          task.id === draggableId
            ? { ...task, status: destination.droppableId as Task["status"] }
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
          description: "Não foi possível atualizar o status da tarefa. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return <div>Carregando tarefas...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {defaultColumns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasks.filter((task) => task.status === column.id)}
          />
        ))}
      </div>
    </DragDropContext>
  );
}