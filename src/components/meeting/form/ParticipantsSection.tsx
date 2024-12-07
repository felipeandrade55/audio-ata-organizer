import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { MeetingParticipant } from "@/types/meeting";

interface ParticipantsSectionProps {
  participants: MeetingParticipant[];
  onAddParticipant: () => void;
  onRemoveParticipant: (index: number) => void;
  onUpdateParticipant: (index: number, field: "name" | "role", value: string) => void;
}

export const ParticipantsSection = ({
  participants,
  onAddParticipant,
  onRemoveParticipant,
  onUpdateParticipant,
}: ParticipantsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Participantes</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAddParticipant}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Participante
        </Button>
      </div>
      {participants.map((participant, index) => (
        <div key={index} className="flex gap-4 items-start">
          <Input
            value={participant.name}
            onChange={(e) => onUpdateParticipant(index, "name", e.target.value)}
            placeholder="Nome"
          />
          <Input
            value={participant.role}
            onChange={(e) => onUpdateParticipant(index, "role", e.target.value)}
            placeholder="Cargo/Função"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemoveParticipant(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};