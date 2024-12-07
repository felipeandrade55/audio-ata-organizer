import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MeetingMinutes } from "@/types/meeting";
import { Clock, Users, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface MeetingListItemProps {
  minute: MeetingMinutes;
  isSelected: boolean;
  onSelect: (id: string, isCheckboxClick: boolean) => void;
  meetingTypeColors: Record<string, string>;
  getStatusBadge: (status: string) => JSX.Element | null;
}

export const MeetingListItem = ({ 
  minute, 
  isSelected, 
  onSelect,
  meetingTypeColors,
  getStatusBadge
}: MeetingListItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full"
    >
      <Card className="p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(minute.id, true);
            }}
            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
          />
          
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => onSelect(minute.id, false)}
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
  );
};