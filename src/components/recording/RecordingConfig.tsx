import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface RecordingConfigProps {
  identificationEnabled: boolean;
  transcriptionService: 'openai' | 'google';
  onIdentificationToggle: (enabled: boolean) => void;
  onServiceChange: (service: 'openai' | 'google') => void;
}

const RecordingConfig = ({
  identificationEnabled,
  transcriptionService,
  onIdentificationToggle,
  onServiceChange,
}: RecordingConfigProps) => {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="identification">Identificação de Participantes</Label>
        <Switch
          id="identification"
          checked={identificationEnabled}
          onCheckedChange={onIdentificationToggle}
        />
      </div>

      <div className="space-y-2">
        <Label>Serviço de Transcrição</Label>
        <Select 
          value={transcriptionService} 
          onValueChange={onServiceChange}
          defaultValue="openai"
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o serviço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI Whisper</SelectItem>
            <SelectItem value="google">Google Cloud Speech-to-Text</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link to="/api-settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurar APIs
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RecordingConfig;