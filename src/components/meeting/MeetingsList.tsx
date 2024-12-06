import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MeetingMinutes } from "@/types/meeting";
import { Bot, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface MeetingsListProps {
  minutes: MeetingMinutes[];
  selectedIds: string[];
  onSelectMinute: (id: string) => void;
}

export const MeetingsList = ({ 
  minutes,
  selectedIds,
  onSelectMinute
}: MeetingsListProps) => {
  const navigate = useNavigate();

  const handleMinuteClick = (minute: MeetingMinutes, isCheckboxClick: boolean) => {
    if (isCheckboxClick) {
      onSelectMinute(minute.id);
      return;
    }
    navigate('/transcription', { 
      state: { 
        minutes: minute,
        date: minute.date,
        segments: [] 
      } 
    });
  };

  const getProcessingStatus = (minute: MeetingMinutes) => {
    const hasTranscription = minute.summary && minute.summary.length > 0;
    
    if (hasTranscription) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Bot className="h-3 w-3" />
          Processado por IA
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Aguardando Processamento
      </Badge>
    );
  };

  // Sort minutes by lastModified in descending order (newest first)
  const sortedMinutes = [...minutes].sort((a, b) => {
    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedMinutes.map((minute) => (
        <motion.div
          key={minute.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="w-full"
        >
          <Card className="p-4 hover:shadow-lg transition-shadow h-full relative">
            <div 
              className="absolute top-4 left-4 z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleMinuteClick(minute, true);
              }}
            >
              <Checkbox
                checked={selectedIds.includes(minute.id)}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
            </div>
            <div 
              className="flex flex-col gap-2 cursor-pointer pl-8"
              onClick={() => handleMinuteClick(minute, false)}
            >
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                {minute.meetingTitle}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {minute.date} - {minute.startTime}
              </p>
              {getProcessingStatus(minute)}
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                {minute.summary || "Sem resumo disponível"}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};