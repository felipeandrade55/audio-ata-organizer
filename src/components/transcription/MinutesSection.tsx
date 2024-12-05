import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import MeetingMinutesDisplay from "../meeting/MeetingMinutesDisplay";
import MeetingMinutesEdit from "../meeting/MeetingMinutesEdit";
import { useToast } from "@/components/ui/use-toast";
import { MeetingMinutes } from "@/types/meeting";
import { motion, AnimatePresence } from "framer-motion";

export const MinutesSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentMinutes, setCurrentMinutes] = useState<MeetingMinutes | null>(null);
  const { toast } = useToast();

  const handleSave = (updatedMinutes: MeetingMinutes) => {
    setCurrentMinutes(updatedMinutes);
    setIsEditing(false);
    toast({
      title: "Ata atualizada",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  if (!currentMinutes) return null;

  return (
    <>
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          {isEditing ? "Cancelar Edição" : "Editar Ata"}
        </Button>
      </div>
      
      <AnimatePresence>
        {isEditing ? (
          <MeetingMinutesEdit
            minutes={currentMinutes}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <MeetingMinutesDisplay minutes={currentMinutes} />
        )}
      </AnimatePresence>
    </>
  );
};