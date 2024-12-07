import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { AgendaItem } from "@/types/meeting";

interface AgendaItemsSectionProps {
  agendaItems: AgendaItem[];
  onAddAgendaItem: () => void;
  onRemoveAgendaItem: (index: number) => void;
  onUpdateAgendaItem: (index: number, field: keyof AgendaItem, value: string) => void;
}

export const AgendaItemsSection = ({
  agendaItems,
  onAddAgendaItem,
  onRemoveAgendaItem,
  onUpdateAgendaItem,
}: AgendaItemsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pauta da Reunião</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAddAgendaItem}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </div>
      {agendaItems.map((item, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-4">
              <Input
                value={item.title}
                onChange={(e) => onUpdateAgendaItem(index, "title", e.target.value)}
                placeholder="Título"
              />
              <Textarea
                value={item.discussion}
                onChange={(e) => onUpdateAgendaItem(index, "discussion", e.target.value)}
                placeholder="Discussão"
              />
              <Input
                value={item.responsible}
                onChange={(e) => onUpdateAgendaItem(index, "responsible", e.target.value)}
                placeholder="Responsável"
              />
              <Input
                value={item.decision}
                onChange={(e) => onUpdateAgendaItem(index, "decision", e.target.value)}
                placeholder="Decisão"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveAgendaItem(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};