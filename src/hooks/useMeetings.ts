import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { MeetingMinutes } from "@/types/meeting";

export const useMeetings = (userId: string | undefined) => {
  const [minutes, setMinutes] = useState<MeetingMinutes[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchMinutes();
    }
  }, [userId]);

  const fetchMinutes = async () => {
    try {
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select(`
          id,
          date,
          start_time,
          end_time,
          location,
          meeting_title,
          organizer,
          summary,
          author,
          approver,
          meeting_type,
          confidentiality_level,
          version,
          status,
          last_modified,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match the MeetingMinutes interface
      const transformedData = data?.map(item => ({
        id: item.id,
        date: item.date,
        startTime: item.start_time,
        endTime: item.end_time,
        location: item.location,
        meetingTitle: item.meeting_title,
        organizer: item.organizer,
        summary: item.summary,
        author: item.author,
        approver: item.approver,
        meetingType: item.meeting_type || 'other',
        confidentialityLevel: item.confidentiality_level,
        version: item.version,
        status: item.status,
        lastModified: item.last_modified,
        participants: [], // These will be loaded separately if needed
        agendaItems: [], // These will be loaded separately if needed
        actionItems: [], // These will be loaded separately if needed
        nextSteps: [], // This might need to be added to the database if required
        legalReferences: [], // These will be loaded separately if needed
        tags: [], // This might need to be added to the database if required
      })) || [];

      setMinutes(transformedData);
    } catch (error) {
      console.error('Erro ao buscar atas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as atas.",
        variant: "destructive",
      });
    }
  };

  return { minutes };
};