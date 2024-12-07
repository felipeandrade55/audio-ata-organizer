import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Calendar, MapPin } from "lucide-react";

interface MinutesHeaderProps {
  title: string;
  date: string;
  time: string;
  location: string;
  status?: "draft" | "review" | "approved";
}

const MinutesHeader = ({ title, date, time, location, status = "draft" }: MinutesHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg"
    >
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Badge className={getStatusColor(status)}>
          {status === "draft" && "Rascunho"}
          {status === "review" && "Em Revisão"}
          {status === "approved" && "Aprovada"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Clock className="h-4 w-4" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MinutesHeader;