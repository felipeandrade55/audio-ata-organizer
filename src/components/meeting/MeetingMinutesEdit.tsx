import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MeetingMinutes } from "@/types/meeting";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MeetingMinutesEditProps {
  minutes: MeetingMinutes;
  onSave: (minutes: MeetingMinutes) => void;
  onCancel: () => void;
}

const MeetingMinutesEdit = ({ minutes, onSave, onCancel }: MeetingMinutesEditProps) => {
  const { toast } = useToast();
  const form = useForm<MeetingMinutes>({
    defaultValues: minutes,
  });

  const [participants, setParticipants] = useState(minutes.participants);
  const [agendaItems, setAgendaItems] = useState(minutes.agendaItems);
  const [actionItems, setActionItems] = useState(minutes.actionItems);
  const [nextSteps, setNextSteps] = useState(minutes.nextSteps);

  const onSubmit = (data: MeetingMinutes) => {
    const updatedMinutes = {
      ...data,
      participants,
      agendaItems,
      actionItems,
      nextSteps,
    };
    onSave(updatedMinutes);
    toast({
      title: "Ata atualizada",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const addParticipant = () => {
    setParticipants([...participants, { name: "", role: "" }]);
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index: number, field: "name" | "role", value: string) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, { title: "", discussion: "", responsible: "", decision: "" }]);
  };

  const removeAgendaItem = (index: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index));
  };

  const updateAgendaItem = (index: number, field: keyof typeof agendaItems[0], value: string) => {
    const updated = [...agendaItems];
    updated[index] = { ...updated[index], [field]: value };
    setAgendaItems(updated);
  };

  const addActionItem = () => {
    setActionItems([...actionItems, { task: "", responsible: "", deadline: "" }]);
  };

  const removeActionItem = (index: number) => {
    setActionItems(actionItems.filter((_, i) => i !== index));
  };

  const updateActionItem = (index: number, field: keyof typeof actionItems[0], value: string) => {
    const updated = [...actionItems];
    updated[index] = { ...updated[index], [field]: value };
    setActionItems(updated);
  };

  const addNextStep = () => {
    setNextSteps([...nextSteps, ""]);
  };

  const removeNextStep = (index: number) => {
    setNextSteps(nextSteps.filter((_, i) => i !== index));
  };

  const updateNextStep = (index: number, value: string) => {
    const updated = [...nextSteps];
    updated[index] = value;
    setNextSteps(updated);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de Início</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de Término</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meetingTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título da Reunião</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organizer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizador</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Participantes</h3>
            <Button type="button" variant="outline" size="sm" onClick={addParticipant}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Participante
            </Button>
          </div>
          {participants.map((participant, index) => (
            <div key={index} className="flex gap-4 items-start">
              <Input
                value={participant.name}
                onChange={(e) => updateParticipant(index, "name", e.target.value)}
                placeholder="Nome"
              />
              <Input
                value={participant.role}
                onChange={(e) => updateParticipant(index, "role", e.target.value)}
                placeholder="Cargo/Função"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeParticipant(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pauta da Reunião</h3>
            <Button type="button" variant="outline" size="sm" onClick={addAgendaItem}>
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
                    onChange={(e) => updateAgendaItem(index, "title", e.target.value)}
                    placeholder="Título"
                  />
                  <Textarea
                    value={item.discussion}
                    onChange={(e) => updateAgendaItem(index, "discussion", e.target.value)}
                    placeholder="Discussão"
                  />
                  <Input
                    value={item.responsible}
                    onChange={(e) => updateAgendaItem(index, "responsible", e.target.value)}
                    placeholder="Responsável"
                  />
                  <Input
                    value={item.decision}
                    onChange={(e) => updateAgendaItem(index, "decision", e.target.value)}
                    placeholder="Decisão"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAgendaItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Ações Definidas</h3>
            <Button type="button" variant="outline" size="sm" onClick={addActionItem}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Ação
            </Button>
          </div>
          {actionItems.map((action, index) => (
            <div key={index} className="flex gap-4 items-start">
              <Input
                value={action.task}
                onChange={(e) => updateActionItem(index, "task", e.target.value)}
                placeholder="Tarefa"
              />
              <Input
                value={action.responsible}
                onChange={(e) => updateActionItem(index, "responsible", e.target.value)}
                placeholder="Responsável"
              />
              <Input
                value={action.deadline}
                onChange={(e) => updateActionItem(index, "deadline", e.target.value)}
                placeholder="Prazo"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeActionItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumo da Reunião</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Próximos Passos</h3>
            <Button type="button" variant="outline" size="sm" onClick={addNextStep}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Passo
            </Button>
          </div>
          {nextSteps.map((step, index) => (
            <div key={index} className="flex gap-4 items-start">
              <Input
                value={step}
                onChange={(e) => updateNextStep(index, e.target.value)}
                placeholder="Próximo passo"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeNextStep(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Elaborado por</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="approver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aprovado por</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Alterações</Button>
        </div>
      </form>
    </Form>
  );
};

export default MeetingMinutesEdit;