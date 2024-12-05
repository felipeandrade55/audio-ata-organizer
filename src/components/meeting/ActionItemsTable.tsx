import { motion } from "framer-motion";
import { CheckSquare } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionItem } from "@/types/meeting";

interface ActionItemsTableProps {
  actionItems: ActionItem[];
}

const ActionItemsTable = ({ actionItems }: ActionItemsTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <CheckSquare className="h-6 w-6 text-green-500" />
        <h3 className="text-xl font-semibold">Ações Definidas</h3>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="font-semibold">Tarefa</TableHead>
              <TableHead className="font-semibold">Responsável</TableHead>
              <TableHead className="font-semibold">Prazo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actionItems.map((action, index) => (
              <TableRow 
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <TableCell className="font-medium">{action.task}</TableCell>
                <TableCell>{action.responsible}</TableCell>
                <TableCell>{action.deadline}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default ActionItemsTable;