import { motion } from "framer-motion";
import { ListTodo } from "lucide-react";
import { AgendaItem } from "@/types/meeting";

interface AgendaItemsProps {
  agendaItems: AgendaItem[];
}

const AgendaItems = ({ agendaItems }: AgendaItemsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <ListTodo className="h-6 w-6 text-blue-500" />
        <h3 className="text-xl font-semibold">Pauta da Reunião</h3>
      </div>
      <div className="space-y-4">
        {agendaItems.map((item, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
              Pauta {index + 1}: {item.title}
            </h4>
            {item.discussion && (
              <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                {item.discussion}
              </p>
            )}
            {item.responsible && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-purple-600 dark:text-purple-400">
                  Responsável:
                </span>{" "}
                {item.responsible}
              </p>
            )}
            {item.decision && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Decisão:
                </span>{" "}
                {item.decision}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AgendaItems;