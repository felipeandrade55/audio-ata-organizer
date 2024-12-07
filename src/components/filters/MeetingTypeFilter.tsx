import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface MeetingTypeFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

const meetingTypeColors: Record<string, string> = {
  initial: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  followup: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  review: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  all: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
};

export const MeetingTypeFilter = ({ value, onValueChange }: MeetingTypeFilterProps) => {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Tipo de reunião" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <Badge variant="outline" className={meetingTypeColors.all}>
            Todos
          </Badge>
        </SelectItem>
        <SelectItem value="initial">
          <Badge variant="outline" className={meetingTypeColors.initial}>
            Inicial
          </Badge>
        </SelectItem>
        <SelectItem value="followup">
          <Badge variant="outline" className={meetingTypeColors.followup}>
            Acompanhamento
          </Badge>
        </SelectItem>
        <SelectItem value="review">
          <Badge variant="outline" className={meetingTypeColors.review}>
            Revisão
          </Badge>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};