import { motion } from "framer-motion";
import { User } from "lucide-react";

interface MeetingFooterProps {
  author: string;
  approver?: string;
}

const MeetingFooter = ({ author, approver }: MeetingFooterProps) => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
    >
      <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <User className="h-6 w-6 text-purple-500" />
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Elaborado por</p>
          <p className="text-lg font-semibold">{author}</p>
        </div>
      </div>
      {approver && (
        <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <User className="h-6 w-6 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aprovado por</p>
            <p className="text-lg font-semibold">{approver}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MeetingFooter;