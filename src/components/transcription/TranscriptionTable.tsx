import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, Smile, AlertTriangle, Lightbulb } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Segment {
  speaker: string;
  text: string;
  timestamp: string;
  emotion?: {
    type: string;
    confidence: number;
  };
  triggers?: {
    type: 'task' | 'reminder' | 'decision' | 'risk' | 'highlight';
    text: string;
  }[];
}

interface TranscriptionTableProps {
  segments: Segment[];
  onUpdateSegments: (segments: Segment[]) => void;
}

const TranscriptionTable = ({ segments, onUpdateSegments }: TranscriptionTableProps) => {
  const getEmotionColor = (emotion: { type: string; confidence: number }) => {
    const opacity = Math.max(0.1, Math.min(emotion.confidence, 0.3));
    switch (emotion.type.toLowerCase()) {
      case 'happy':
      case 'joy':
        return `bg-yellow-100/${Math.round(opacity * 100)} dark:bg-yellow-900/${Math.round(opacity * 100)}`;
      case 'sad':
      case 'sadness':
        return `bg-blue-100/${Math.round(opacity * 100)} dark:bg-blue-900/${Math.round(opacity * 100)}`;
      case 'angry':
      case 'anger':
        return `bg-red-100/${Math.round(opacity * 100)} dark:bg-red-900/${Math.round(opacity * 100)}`;
      case 'neutral':
        return '';
      default:
        return `bg-gray-100/${Math.round(opacity * 100)} dark:bg-gray-900/${Math.round(opacity * 100)}`;
    }
  };

  const getEmotionTooltip = (emotion: { type: string; confidence: number }) => {
    const confidencePercent = Math.round(emotion.confidence * 100);
    return `Emoção detectada: ${emotion.type} (${confidencePercent}% de confiança)`;
  };

  const getTriggerColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'reminder':
        return 'bg-yellow-100 dark:bg-yellow-900/30 underline';
      case 'decision':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'risk':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'highlight':
        return 'bg-purple-100 dark:bg-purple-900/30';
      default:
        return '';
    }
  };

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

  const getTriggerTooltip = (trigger: Segment['triggers'][0]) => {
    const typeLabels = {
      task: 'Nova Tarefa',
      reminder: 'Lembrete',
      decision: 'Decisão',
      risk: 'Risco Identificado',
      highlight: 'Destaque',
    };
    return `${typeLabels[trigger.type]}: ${trigger.text}`;
  };

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4">
        {segments.map((segment, index) => (
          <div 
            key={index} 
            className={`rounded-lg p-4 space-y-2 border ${segment.emotion ? getEmotionColor(segment.emotion) : ''}`}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">{segment.timestamp}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{segment.speaker}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <p className={`text-sm flex-grow ${segment.triggers?.length ? getTriggerColor(segment.triggers[0].type) : ''}`}>
                {segment.text}
              </p>
              <div className="flex gap-1">
                {segment.emotion && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Smile className="h-4 w-4 text-red-500 flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {getEmotionTooltip(segment.emotion)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {segment.triggers?.map((trigger, i) => (
                  <TooltipProvider key={i}>
                    <Tooltip>
                      <TooltipTrigger>
                        {getTriggerIcon(trigger.type)}
                      </TooltipTrigger>
                      <TooltipContent>
                        {getTriggerTooltip(trigger)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24 sm:w-32">Horário</TableHead>
            <TableHead className="w-32 sm:w-40">Participante</TableHead>
            <TableHead className="min-w-[200px]">Fala</TableHead>
            <TableHead className="w-16 sm:w-20">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {segments.map((segment, index) => (
            <TableRow 
              key={index}
              className={segment.emotion ? getEmotionColor(segment.emotion) : ''}
            >
              <TableCell className="whitespace-nowrap">{segment.timestamp}</TableCell>
              <TableCell>
                <span className="whitespace-nowrap">{segment.speaker}</span>
              </TableCell>
              <TableCell className="max-w-[300px] sm:max-w-none">
                <div className="break-words flex items-start gap-2">
                  <span className={segment.triggers?.length ? getTriggerColor(segment.triggers[0].type) : ''}>
                    {segment.text}
                  </span>
                  <div className="flex gap-1">
                    {segment.emotion && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Smile className="h-4 w-4 text-red-500 flex-shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {getEmotionTooltip(segment.emotion)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {segment.triggers?.map((trigger, i) => (
                      <TooltipProvider key={i}>
                        <Tooltip>
                          <TooltipTrigger>
                            {getTriggerIcon(trigger.type)}
                          </TooltipTrigger>
                          <TooltipContent>
                            {getTriggerTooltip(trigger)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {/* ... Ações dos segmentos se necessário */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TranscriptionTable;
