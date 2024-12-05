import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecordingConfigProps {
  apiKey: string;
  identificationEnabled: boolean;
  transcriptionService: 'openai' | 'google';
  onApiKeyChange: (key: string) => void;
  onIdentificationToggle: (enabled: boolean) => void;
  onServiceChange: (service: 'openai' | 'google') => void;
}

const RecordingConfig = ({
  apiKey,
  identificationEnabled,
  transcriptionService,
  onApiKeyChange,
  onIdentificationToggle,
  onServiceChange,
}: RecordingConfigProps) => {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="api-key">Chave da API ({transcriptionService === 'openai' ? 'OpenAI' : 'Google Cloud'})</Label>
        <Input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder={`Insira sua chave da API ${transcriptionService === 'openai' ? 'OpenAI' : 'Google Cloud'}`}
        />
      </div>

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
        <Select value={transcriptionService} onValueChange={onServiceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o serviço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI Whisper</SelectItem>
            <SelectItem value="google">Google Cloud Speech-to-Text</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RecordingConfig;