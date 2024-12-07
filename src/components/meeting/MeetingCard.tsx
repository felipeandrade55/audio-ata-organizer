import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MeetingMinutes } from "@/types/meeting";
import { Bot, Clock, Users, FileText, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface MeetingCardProps {
  minute: MeetingMinutes;
  isSelected: boolean;
  onSelect: (id: string, isCheckboxClick: boolean) => void;
  meetingTypeColors: Record<string, string>;
}

export const MeetingCard = ({ 
  minute, 
  isSelected, 
  onSelect,
  meetingTypeColors 
}: MeetingCardProps) => {
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
            <Clock className="h-3 w-3" />
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

  return (
    <motion.div
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
            onSelect(minute.id, true);
          }}
        >
          <Checkbox
            checked={isSelected}
            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
          />
        </div>
        <div 
          className="flex flex-col gap-2 cursor-pointer pl-8"
          onClick={() => onSelect(minute.id, false)}
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
  );
};