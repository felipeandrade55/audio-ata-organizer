import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";

interface RecordingConfigProps {
  transcriptionService: 'openai' | 'google';
  onServiceChange: (service: 'openai' | 'google') => void;
}

const RecordingConfig = ({
  transcriptionService,
  onServiceChange,
}: RecordingConfigProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="w-full max-w-md space-y-4"
    >
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Settings2 className="h-4 w-4" />
        <span>Configurações de Transcrição</span>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <div className="space-y-2">
          <Label>Serviço de Transcrição</Label>
          <RadioGroup
            value={transcriptionService}
            onValueChange={(value) => onServiceChange(value as 'openai' | 'google')}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="openai" id="openai" />
              <Label htmlFor="openai">OpenAI (Whisper)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="google" id="google" />
              <Label htmlFor="google">Google Cloud Speech-to-Text</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </motion.div>
  );
};

export default RecordingConfig;