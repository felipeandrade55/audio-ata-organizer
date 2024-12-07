import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { ActionItem } from "@/types/meeting";

interface ActionItemsSectionProps {
  actionItems: ActionItem[];
  onAddActionItem: () => void;
  onRemoveActionItem: (index: number) => void;
  onUpdateActionItem: (index: number, field: keyof ActionItem, value: string) => void;
}

export const ActionItemsSection = ({
  actionItems,
  onAddActionItem,
  onRemoveActionItem,
  onUpdateActionItem,
}: ActionItemsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Ações Definidas</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAddActionItem}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Ação
        </Button>
      </div>
      {actionItems.map((action, index) => (
        <div key={index} className="flex gap-4 items-start">
          <Input
            value={action.task}
            onChange={(e) => onUpdateActionItem(index, "task", e.target.value)}
            placeholder="Tarefa"
          />
          <Input
            value={action.responsible}
            onChange={(e) => onUpdateActionItem(index, "responsible", e.target.value)}
            placeholder="Responsável"
          />
          <Input
            value={action.deadline}
            onChange={(e) => onUpdateActionItem(index, "deadline", e.target.value)}
            placeholder="Prazo"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemoveActionItem(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};