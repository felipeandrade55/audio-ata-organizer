import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "done";
  deadline?: string;
  priority?: string;
}

interface KanbanBoardProps {
  userId: string;
}

const columns = [
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

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "alta":
        return "bg-red-500";
      case "média":
        return "bg-yellow-500";
      case "baixa":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return <div>Carregando tarefas...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <Card key={column.id} className="bg-gray-50 dark:bg-gray-800/50">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold flex justify-between items-center">
                {column.title}
                <Badge variant="secondary" className="ml-2">
                  {tasks.filter((task) => task.status === column.id).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px]"
                  >
                    {tasks
                      .filter((task) => task.status === column.id)
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2"
                            >
                              <Card className="bg-white dark:bg-gray-800 shadow-sm">
                                <CardContent className="p-4">
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                      <h3 className="font-medium">{task.title}</h3>
                                      {task.priority && (
                                        <Badge
                                          className={`${getPriorityColor(
                                            task.priority
                                          )} text-white`}
                                        >
                                          {task.priority}
                                        </Badge>
                                      )}
                                    </div>
                                    {task.description && (
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {task.description}
                                      </p>
                                    )}
                                    {task.deadline && (
                                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {format(new Date(task.deadline), "PPP", {
                                          locale: ptBR,
                                        })}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        ))}
      </div>
    </DragDropContext>
  );
}