import { useState } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useQuery } from "@tanstack/react-query";

interface EventFormData {
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  location?: string;
}

export default function Calendar() {
  const { user } = useSupabase();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<EventFormData>();

  const { data: events = [], refetch } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data.map(event => ({
        ...event,
        startTime: new Date(event.start_time),
        endTime: event.end_time ? new Date(event.end_time) : undefined
      }));
    },
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user?.id,
          title: data.title,
          description: data.description,
          start_time: data.startTime,
          end_time: data.endTime,
          location: data.location,
          event_type: 'meeting',
        });

      if (error) throw error;

      toast.success("Evento criado com sucesso!");
      setIsDialogOpen(false);
      reset();
      refetch();
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      toast.error("Erro ao criar evento");
    }
  };

  const handleEventApprove = async () => {
    await refetch();
  };

  const handleEventReject = async () => {
    await refetch();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Calendário</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Evento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" {...register("title", { required: true })} />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" {...register("description")} />
              </div>
              <div>
                <Label htmlFor="startTime">Data e Hora de Início</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  {...register("startTime", { required: true })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Data e Hora de Término</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  {...register("endTime")}
                />
              </div>
              <div>
                <Label htmlFor="location">Local</Label>
                <Input id="location" {...register("location")} />
              </div>
              <Button type="submit" className="w-full">
                Criar Evento
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <CalendarView
        events={events}
        onEventApprove={handleEventApprove}
        onEventReject={handleEventReject}
      />
    </div>
  );
}