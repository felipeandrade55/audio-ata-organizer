import { motion } from "framer-motion";
import { CheckSquare } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ActionItem } from "@/types/meeting";

interface ActionItemsTableProps {
  actionItems?: ActionItem[];
}

const ActionItemsTable = ({ actionItems = [] }: ActionItemsTableProps) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

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
              <TableHead className="font-semibold">Prioridade</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
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
                <TableCell>
                  <Badge className={getPriorityColor(action.priority)}>
                    {action.priority || 'Não definida'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(action.status)}>
                    {action.status === 'completed' && 'Concluída'}
                    {action.status === 'in_progress' && 'Em Andamento'}
                    {action.status === 'pending' && 'Pendente'}
                    {!action.status && 'Não definido'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default ActionItemsTable;