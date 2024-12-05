import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface RegisterFieldsProps {
  name: string;
  setName: (value: string) => void;
  oab: string;
  setOab: (value: string) => void;
}

export const RegisterFields = ({ name, setName, oab, setOab }: RegisterFieldsProps) => {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="oab">Número da OAB</Label>
        <Input
          id="oab"
          type="text"
          value={oab}
          onChange={(e) => setOab(e.target.value)}
          required
          className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </motion.div>
  );
};