import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

interface TranscriptionAnalysisStatusProps {
  isAnalyzing: boolean;
}

export const TranscriptionAnalysisStatus = ({ isAnalyzing }: TranscriptionAnalysisStatusProps) => {
  if (!isAnalyzing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg flex items-center gap-3"
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="font-medium">Processando transcrição com IA...</span>
    </motion.div>
  );
};