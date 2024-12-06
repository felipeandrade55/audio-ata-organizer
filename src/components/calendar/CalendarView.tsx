import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Check, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  location?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventApprove?: (event: CalendarEvent) => void;
  onEventReject?: (event: CalendarEvent) => void;
}

export const CalendarView = ({ events, onEventApprove, onEventReject }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const handleEventApprove = async (event: CalendarEvent) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .update({ status: 'confirmed' })
        .eq('id', event.id);
        
      if (error) throw error;
      
      toast.success("Evento confirmado com sucesso!");
      onEventApprove?.(event);
    } catch (error) {
      console.error('Erro ao confirmar evento:', error);
      toast.error("Erro ao confirmar evento");
    }
  };
  
  const handleEventReject = async (event: CalendarEvent) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .update({ status: 'cancelled' })
        .eq('id', event.id);
        
      if (error) throw error;
      
      toast.success("Evento rejeitado");
      onEventReject?.(event);
    } catch (error) {
      console.error('Erro ao rejeitar evento:', error);
      toast.error("Erro ao rejeitar evento");
    }
  };

  const selectedDateEvents = events.filter(event => {
    if (!selectedDate) return false;
    const eventDate = new Date(event.startTime);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-purple-500" />
        <h2 className="text-lg font-semibold">Calendário de Eventos</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </Card>
        
        <Card className="p-4">
          <h3 className="font-medium mb-4">
            Eventos para {selectedDate?.toLocaleDateString('pt-BR')}
          </h3>
          
          <AnimatePresence mode="wait">
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {event.description}
                          </p>
                        )}
                        <div className="text-sm text-gray-500 mt-2">
                          {new Date(event.startTime).toLocaleTimeString('pt-BR')}
                          {event.endTime && ` - ${new Date(event.endTime).toLocaleTimeString('pt-BR')}`}
                        </div>
                      </div>
                      
                      {event.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                            onClick={() => handleEventApprove(event)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleEventReject(event)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-center py-4"
              >
                Nenhum evento encontrado para esta data
              </motion.p>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
};