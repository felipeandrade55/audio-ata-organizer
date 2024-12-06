import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Droppable } from "@hello-pangea/dnd";
import { KanbanTask } from "./KanbanTask";
import { KanbanColumnHeader } from "./KanbanColumnHeader";
import { Task } from "./types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTitleChange: (newTitle: string) => void;
  onDelete: () => void;
  onTaskCreate: (task: Task) => void;
}

export function KanbanColumn({
  id,
  title,
  tasks,
  onTitleChange,
  onDelete,
  onTaskCreate,
}: KanbanColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const { toast } = useToast();

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const { data, error } = await supabase
        .from("kanban_tasks")
        .insert({
          title: newTaskTitle,
          status: id, // This is the column ID
          column_id: id, // Set the column_id to match the current column
        })
        .select()
        .single();

      if (error) throw error;

      onTaskCreate(data);
      setNewTaskTitle("");
      setIsAddingTask(false);
      toast({
        title: "Tarefa criada",
        description: "A tarefa foi criada com sucesso.",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Erro ao criar tarefa",
        description: "Não foi possível criar a tarefa.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gray-50 dark:bg-gray-800/50">
      <KanbanColumnHeader
        id={id}
        title={title}
        taskCount={tasks.length}
        onDelete={onDelete}
        onTitleChange={onTitleChange}
      />
      <CardContent className="p-2">
        <Droppable droppableId={id}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="min-h-[200px]"
            >
              {tasks.map((task, index) => (
                <KanbanTask key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
              {isAddingTask ? (
                <div className="p-2">
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Digite o título da tarefa"
                    className="mb-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreateTask();
                      } else if (e.key === "Escape") {
                        setIsAddingTask(false);
                        setNewTaskTitle("");
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleCreateTask}>
                      Adicionar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAddingTask(false);
                        setNewTaskTitle("");
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full mt-2"
                  onClick={() => setIsAddingTask(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar tarefa
                </Button>
              )}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
}