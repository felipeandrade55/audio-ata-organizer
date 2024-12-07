import { useNavigate } from "react-router-dom";
import { MeetingMinutes } from "@/types/meeting";
import { MeetingCard } from "./MeetingCard";
import { MeetingListItem } from "./MeetingListItem";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  // Sort minutes by lastModified in descending order (newest first)
  const sortedMinutes = [...minutes].sort((a, b) => {
    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
  });

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedMinutes.map((minute) => (
        <MeetingCard
          key={minute.id}
          minute={minute}
          isSelected={selectedIds.includes(minute.id)}
          onSelect={(id, isCheckboxClick) => handleMinuteClick(minute, isCheckboxClick)}
          meetingTypeColors={meetingTypeColors}
        />
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {sortedMinutes.map((minute) => (
        <MeetingListItem
          key={minute.id}
          minute={minute}
          isSelected={selectedIds.includes(minute.id)}
          onSelect={(id, isCheckboxClick) => handleMinuteClick(minute, isCheckboxClick)}
          meetingTypeColors={meetingTypeColors}
          getStatusBadge={getStatusBadge}
        />
      ))}
    </div>
  );

  return viewMode === "grid" ? renderGridView() : renderListView();
};