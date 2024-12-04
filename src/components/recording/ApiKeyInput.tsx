import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="relative">
        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="password"
          placeholder="Insira sua chave da API OpenAI"
          value={apiKey}
          onChange={handleApiKeyChange}
          className="pl-10 pr-4 h-11 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
        />
      </div>
    </motion.div>
  );
};

export default ApiKeyInput;