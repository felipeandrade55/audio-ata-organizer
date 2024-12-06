import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateRangeFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const DateRangeFilter = ({ value, onValueChange }: DateRangeFilterProps) => {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrar por período" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="today">Hoje</SelectItem>
        <SelectItem value="week">Última semana</SelectItem>
        <SelectItem value="month">Último mês</SelectItem>
        <SelectItem value="all">Todos</SelectItem>
      </SelectContent>
    </Select>
  );
};