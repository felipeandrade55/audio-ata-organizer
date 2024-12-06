import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MeetingMinutes } from "@/types/meeting";

interface MeetingsListProps {
  minutes: MeetingMinutes[];
}

export const MeetingsList = ({ minutes }: MeetingsListProps) => {
  const navigate = useNavigate();

  const handleMinuteClick = (minute: MeetingMinutes) => {
    navigate('/transcription', { 
      state: { 
        minutes: minute,
        date: minute.date,
        segments: [] 
      } 
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {minutes.map((minute) => (
        <motion.div
          key={minute.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="cursor-pointer"
          onClick={() => handleMinuteClick(minute)}
        >
          <Card className="p-4 hover:shadow-lg transition-shadow">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              {minute.meetingTitle}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {minute.date} - {minute.startTime}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
              {minute.summary || "Sem resumo disponível"}
            </p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};