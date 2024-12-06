import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Draggable } from "@hello-pangea/dnd";
import { Task } from "./types";

interface KanbanTaskProps {
  task: Task;
  index: number;
}

export function KanbanTask({ task, index }: KanbanTaskProps) {
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

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
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
                    <Badge className={`${getPriorityColor(task.priority)} text-white`}>
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
                    {format(new Date(task.deadline), "PPP", { locale: ptBR })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}