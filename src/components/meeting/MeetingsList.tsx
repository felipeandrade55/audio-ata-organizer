import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MeetingMinutes } from "@/types/meeting";
import { Bot, Clock, Users, FileText, CheckCircle, XCircle, Clock as ClockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface MeetingsListProps {
  minutes: MeetingMinutes[];
  selectedIds: string[];
  onSelectMinute: (id: string) => void;
  viewMode: "grid" | "list";
}

const meetingTypeColors: Record<string, string> = {
  initial: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  followup: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  review: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
};

export const MeetingsList = ({ 
  minutes,
  selectedIds,
  onSelectMinute,
  viewMode
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Aprovada
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            Pendente
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejeitada
          </Badge>
        );
      default:
        return null;
    }
  };

  // Sort minutes by lastModified in descending order (newest first)
  const sortedMinutes = [...minutes].sort((a, b) => {
    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
  });

  const renderGridView = () => (
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
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                  {minute.meetingTitle}
                </h4>
                <Badge 
                  variant="outline" 
                  className={meetingTypeColors[minute.meetingType as keyof typeof meetingTypeColors]}
                >
                  {minute.meetingType === "initial" ? "Inicial" : 
                   minute.meetingType === "followup" ? "Acompanhamento" : "Revisão"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{minute.date} - {minute.startTime}</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {getStatusBadge(minute.status || "pending")}
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {minute.participants?.length || 0} participantes
                </Badge>

                {minute.summary && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    Processado
                  </Badge>
                )}

                {/* Adicionar badge para anexos se houver */}
                {minute.attachments?.length > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {minute.attachments.length} anexos
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                {minute.summary || "Sem resumo disponível"}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {sortedMinutes.map((minute) => (
        <motion.div
          key={minute.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full"
        >
          <Card className="p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedIds.includes(minute.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMinute(minute.id);
                }}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => handleMinuteClick(minute, false)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {minute.meetingTitle}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={meetingTypeColors[minute.meetingType as keyof typeof meetingTypeColors]}
                    >
                      {minute.meetingType === "initial" ? "Inicial" : 
                       minute.meetingType === "followup" ? "Acompanhamento" : "Revisão"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(minute.status || "pending")}
                    
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {minute.participants?.length || 0}
                    </Badge>

                    {minute.attachments?.length > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {minute.attachments.length}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{minute.date} - {minute.startTime}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  return viewMode === "grid" ? renderGridView() : renderListView();
};