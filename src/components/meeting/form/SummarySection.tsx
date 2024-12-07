import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MeetingMinutes } from "@/types/meeting";

interface SummarySectionProps {
  form: UseFormReturn<MeetingMinutes>;
}

export const SummarySection = ({ form }: SummarySectionProps) => {
  return (
    <FormField
      control={form.control}
      name="summary"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Resumo da Reunião</FormLabel>
          <FormControl>
            <Textarea {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};