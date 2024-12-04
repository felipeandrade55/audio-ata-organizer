import { Input } from "@/components/ui/input";

interface ApiKeyInputProps {
  apiKey: string;
  onChange: (value: string) => void;
}

const ApiKeyInput = ({ apiKey, onChange }: ApiKeyInputProps) => {
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    onChange(newApiKey);
    localStorage.setItem('openai_api_key', newApiKey);
  };

  return (
    <Input
      type="password"
      placeholder="Insira sua chave da API OpenAI"
      value={apiKey}
      onChange={handleApiKeyChange}
      className="mb-4"
    />
  );
};

export default ApiKeyInput;