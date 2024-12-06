import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MeetingTypeFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

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
        <SelectItem value="all">Todos</SelectItem>
        <SelectItem value="initial">Inicial</SelectItem>
        <SelectItem value="followup">Acompanhamento</SelectItem>
        <SelectItem value="review">Revisão</SelectItem>
      </SelectContent>
    </Select>
  );
};