import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MeetingMinutes } from "@/types/meeting";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { MeetingBasicInfo } from "./form/MeetingBasicInfo";
import { ParticipantsSection } from "./form/ParticipantsSection";
import { AgendaItemsSection } from "./form/AgendaItemsSection";
import { ActionItemsSection } from "./form/ActionItemsSection";
import { SummarySection } from "./form/SummarySection";
import { NextStepsSection } from "./form/NextStepsSection";
import { ApprovalSection } from "./form/ApprovalSection";
import { motion } from "framer-motion";
import { 
  FileText, 
  Users, 
  ListTodo, 
  CheckSquare, 
  FileCheck, 
  ArrowRight, 
  User 
} from "lucide-react";

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

  // Participant handlers
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

  // Agenda item handlers
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

  // Action item handlers
  const addActionItem = () => {
    setActionItems([...actionItems, {
      task: "",
      responsible: "",
      deadline: "",
      priority: "medium",
      status: "pending"
    }]);
  };

  const removeActionItem = (index: number) => {
    setActionItems(actionItems.filter((_, i) => i !== index));
  };

  const updateActionItem = (index: number, field: keyof typeof actionItems[0], value: string) => {
    const updated = [...actionItems];
    updated[index] = { ...updated[index], [field]: value };
    setActionItems(updated);
  };

  // Next step handlers
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-6 w-6 text-purple-500" />
            <h2 className="text-2xl font-semibold">Editar Ata da Reunião</h2>
          </div>
          <MeetingBasicInfo form={form} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-semibold">Participantes</h3>
          </div>
          <ParticipantsSection
            participants={participants}
            onAddParticipant={addParticipant}
            onRemoveParticipant={removeParticipant}
            onUpdateParticipant={updateParticipant}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <ListTodo className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-semibold">Pauta</h3>
          </div>
          <AgendaItemsSection
            agendaItems={agendaItems}
            onAddAgendaItem={addAgendaItem}
            onRemoveAgendaItem={removeAgendaItem}
            onUpdateAgendaItem={updateAgendaItem}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckSquare className="h-6 w-6 text-orange-500" />
            <h3 className="text-xl font-semibold">Ações</h3>
          </div>
          <ActionItemsSection
            actionItems={actionItems}
            onAddActionItem={addActionItem}
            onRemoveActionItem={removeActionItem}
            onUpdateActionItem={updateActionItem}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileCheck className="h-6 w-6 text-indigo-500" />
            <h3 className="text-xl font-semibold">Resumo</h3>
          </div>
          <SummarySection form={form} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight className="h-6 w-6 text-teal-500" />
            <h3 className="text-xl font-semibold">Próximos Passos</h3>
          </div>
          <NextStepsSection
            nextSteps={nextSteps}
            onAddNextStep={addNextStep}
            onRemoveNextStep={removeNextStep}
            onUpdateNextStep={updateNextStep}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="h-6 w-6 text-purple-500" />
            <h3 className="text-xl font-semibold">Aprovação</h3>
          </div>
          <ApprovalSection form={form} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-end gap-4 sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t"
        >
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Alterações</Button>
        </motion.div>
      </form>
    </Form>
  );
};

export default MeetingMinutesEdit;