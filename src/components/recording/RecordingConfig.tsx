import ApiKeyInput from "./ApiKeyInput";
import IdentificationSwitch from "./IdentificationSwitch";

interface RecordingConfigProps {
  apiKey: string;
  identificationEnabled: boolean;
  onApiKeyChange: (key: string) => void;
  onIdentificationToggle: (enabled: boolean) => void;
}

const RecordingConfig = ({
  apiKey,
  identificationEnabled,
  onApiKeyChange,
  onIdentificationToggle,
}: RecordingConfigProps) => {
  return (
    <div className="w-full space-y-4 animate-fade-in">
      <ApiKeyInput apiKey={apiKey} onChange={onApiKeyChange} />
      <IdentificationSwitch
        enabled={identificationEnabled}
        onToggle={onIdentificationToggle}
      />
    </div>
  );
};

export default RecordingConfig;