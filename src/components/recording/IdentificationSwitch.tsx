import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface IdentificationSwitchProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const IdentificationSwitch = ({ enabled, onToggle }: IdentificationSwitchProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Switch
        id="identification-mode"
        checked={enabled}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="identification-mode">
        Identificar participantes antes de gravar
      </Label>
    </div>
  );
};

export default IdentificationSwitch;