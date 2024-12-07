import { motion } from "framer-motion";
import { FileCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MeetingSummaryProps {
  summary: string;
  nextSteps?: string[];
}

const MeetingSummary = ({ summary, nextSteps = [] }: MeetingSummaryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="space-y-8"
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileCheck className="h-6 w-6 text-indigo-500" />
            <h3 className="text-xl font-semibold">Resumo da Reunião</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {summary}
          </p>
        </CardContent>
      </Card>

      {nextSteps.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 mb-4">
              <ArrowRight className="h-6 w-6 text-purple-500" />
              <h3 className="text-xl font-semibold">Próximos Passos</h3>
            </div>
            <div className="space-y-3">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">{step}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default MeetingSummary;