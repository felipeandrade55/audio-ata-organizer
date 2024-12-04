import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";

interface IdentificationSwitchProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const IdentificationSwitch = ({ enabled, onToggle }: IdentificationSwitchProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex items-center space-x-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
    >
      <UserCheck className="h-5 w-5 text-gray-500" />
      <div className="flex-1">
        <Label 
          htmlFor="identification-mode"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Identificar participantes
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          Ative para identificar os participantes antes de iniciar a gravação
        </p>
      </div>
      <Switch
        id="identification-mode"
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-purple-600"
      />
    </motion.div>
  );
};

export default IdentificationSwitch;