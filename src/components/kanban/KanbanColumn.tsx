import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droppable } from "@hello-pangea/dnd";
import { KanbanTask } from "./KanbanTask";
import { Task } from "./types";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  return (
    <Card key={id} className="bg-gray-50 dark:bg-gray-800/50">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          {title}
          <Badge variant="secondary" className="ml-2">
            {tasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
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
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
}