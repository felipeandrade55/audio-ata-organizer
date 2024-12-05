import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, FileText } from "lucide-react";

interface MeetingInfoCardProps {
  icon: typeof Calendar | typeof Clock | typeof MapPin | typeof FileText;
  title: string;
  value: string;
  color: string;
}

const MeetingInfoCard = ({ icon: Icon, title, value, color }: MeetingInfoCardProps) => {
  return (
    <motion.div 
      className="flex items-center space-x-4 p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Icon className={`h-6 w-6 ${color}`} />
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </motion.div>
  );
};

export default MeetingInfoCard;