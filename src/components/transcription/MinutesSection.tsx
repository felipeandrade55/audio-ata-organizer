import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Wand2 } from "lucide-react";
import MeetingMinutesDisplay from "../meeting/MeetingMinutesDisplay";
import MeetingMinutesEdit from "../meeting/MeetingMinutesEdit";
import { useToast } from "@/components/ui/use-toast";
import { MeetingMinutes } from "@/types/meeting";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface MinutesSectionProps {
  minutes: MeetingMinutes;
  onMinutesUpdate: (minutes: MeetingMinutes) => void;
}

export const MinutesSection = ({ minutes, onMinutesUpdate }: MinutesSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleSave = (updatedMinutes: MeetingMinutes) => {
    onMinutesUpdate(updatedMinutes);
    setIsEditing(false);
    toast({
      title: "Ata atualizada",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const suggestAgenda = async () => {
    if (!minutes.summary) {
      toast({
        title: "Resumo não encontrado",
        description: "É necessário ter um resumo da reunião para gerar sugestões de pauta.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-summary', {
        body: { summary: minutes.summary }
      });

      if (error) throw error;

      const updatedMinutes = {
        ...minutes,
        agendaItems: [
          ...(minutes.agendaItems || []),
          ...data.suggestedAgendaItems.map((item: any, index: number) => ({
            ...item,
            order_index: (minutes.agendaItems?.length || 0) + index
          }))
        ]
      };

      onMinutesUpdate(updatedMinutes);

      toast({
        title: "Sugestões de pauta geradas",
        description: data.reasoning,
      });
    } catch (error) {
      console.error('Error suggesting agenda:', error);
      toast({
        title: "Erro ao gerar sugestões",
        description: "Não foi possível gerar sugestões de pauta neste momento.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          onClick={suggestAgenda}
          disabled={isAnalyzing}
          className="gap-2"
        >
          <Wand2 className="h-4 w-4" />
          {isAnalyzing ? "Gerando sugestões..." : "Sugerir Pauta"}
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          {isEditing ? "Cancelar Edição" : "Editar Ata"}
        </Button>
      </div>
      
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MeetingMinutesEdit
              minutes={minutes}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MeetingMinutesDisplay minutes={minutes} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};