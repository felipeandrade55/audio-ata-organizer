import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit2, Save, AlertTriangle, Lightbulb } from "lucide-react";

interface TriggerTooltipProps {
  trigger: {
    type: 'task' | 'reminder' | 'decision' | 'risk' | 'highlight';
    text: string;
  };
}

export const TriggerTooltip = ({ trigger }: TriggerTooltipProps) => {
  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <Edit2 className="h-4 w-4 text-blue-500" />;
      case 'reminder':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'decision':
        return <Save className="h-4 w-4 text-green-500" />;
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'highlight':
        return <Lightbulb className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getTriggerTooltip = (trigger: TriggerTooltipProps['trigger']) => {
    const typeLabels = {
      task: 'Nova Tarefa',
      reminder: 'Lembrete',
      decision: 'Decisão',
      risk: 'Risco Identificado',
      highlight: 'Destaque',
    };
    return `${typeLabels[trigger.type]}: ${trigger.text}`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {getTriggerIcon(trigger.type)}
        </TooltipTrigger>
        <TooltipContent>
          {getTriggerTooltip(trigger)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};