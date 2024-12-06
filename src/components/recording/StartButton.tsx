import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface StartButtonProps {
  onStartRecording: () => void;
}

const StartButton = ({ onStartRecording }: StartButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      onClick={onStartRecording}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      size="lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2"
      >
        <Mic className="w-5 h-5" />
        <span>Iniciar Gravação</span>
      </motion.div>
    </Button>
  );
};

export default StartButton;