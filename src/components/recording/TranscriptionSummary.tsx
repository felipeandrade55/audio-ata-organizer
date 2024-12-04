import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

interface TranscriptionSummaryProps {
  duration: string;
  participantCount: number;
  onViewFullTranscription: () => void;
}

const TranscriptionSummary = ({
  duration,
  participantCount,
  onViewFullTranscription,
}: TranscriptionSummaryProps) => {
  return (
    <Card className="w-full mt-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700">
      <CardContent className="pt-6">
        <motion.div 
          className="flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Duração Total</p>
                <p className="text-lg font-semibold">{duration}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Participantes</p>
                <p className="text-lg font-semibold">{participantCount}</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={onViewFullTranscription} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Ver Transcrição Completa
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default TranscriptionSummary;