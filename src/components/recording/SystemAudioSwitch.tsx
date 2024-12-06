import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Speaker } from "lucide-react";

interface SystemAudioSwitchProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const SystemAudioSwitch = ({ enabled, onToggle }: SystemAudioSwitchProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex items-center space-x-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
    >
      <Speaker className="h-5 w-5 text-gray-500" />
      <div className="flex-1">
        <Label 
          htmlFor="system-audio"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Gravar áudio do sistema
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          Ative para capturar o áudio reproduzido pelo dispositivo
        </p>
      </div>
      <Switch
        id="system-audio"
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-purple-600"
      />
    </motion.div>
  );
};

export default SystemAudioSwitch;