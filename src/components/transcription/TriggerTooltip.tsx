import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit2, Save, AlertTriangle, Lightbulb, Clock, FileText, Scale, Lock, Handshake, CalendarDays, Pencil, UserCog } from "lucide-react";

interface TriggerTooltipProps {
  trigger: {
    type: 'task' | 'reminder' | 'decision' | 'risk' | 'highlight' | 'deadline' | 'document' | 'legal' | 'confidential' | 'agreement' | 'followup' | 'schedule' | 'note';
    text: string;
    context?: string;
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
      case 'deadline':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-cyan-500" />;
      case 'legal':
        return <Scale className="h-4 w-4 text-indigo-500" />;
      case 'confidential':
        return <Lock className="h-4 w-4 text-rose-500" />;
      case 'agreement':
        return <Handshake className="h-4 w-4 text-emerald-500" />;
      case 'followup':
        return <UserCog className="h-4 w-4 text-violet-500" />;
      case 'schedule':
        return <CalendarDays className="h-4 w-4 text-teal-500" />;
      case 'note':
        return <Pencil className="h-4 w-4 text-amber-500" />;
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
      deadline: 'Prazo',
      document: 'Documento',
      legal: 'Base Legal',
      confidential: 'Confidencial',
      agreement: 'Acordo',
      followup: 'Pendência do Cliente',
      schedule: 'Agendamento',
      note: 'Anotação',
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