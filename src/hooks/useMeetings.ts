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
      // First, fetch the basic meeting minutes data
      const { data: meetingsData, error: meetingsError } = await supabase
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
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (meetingsError) {
        throw meetingsError;
      }

      // Transform the data to match the MeetingMinutes interface
      const transformedData: MeetingMinutes[] = await Promise.all((meetingsData || []).map(async (item) => {
        // Fetch participants for this meeting
        const { data: participants } = await supabase
          .from('meeting_participants')
          .select('*')
          .eq('meeting_id', item.id);

        // Fetch agenda items for this meeting
        const { data: agendaItems } = await supabase
          .from('agenda_items')
          .select('*')
          .eq('meeting_id', item.id);

        // Fetch action items for this meeting
        const { data: actionItems } = await supabase
          .from('action_items')
          .select('*')
          .eq('meeting_id', item.id);

        // Fetch legal references for this meeting
        const { data: legalRefs } = await supabase
          .from('legal_references')
          .select('*')
          .eq('meeting_id', item.id);

        return {
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
          participants: participants || [],
          agendaItems: agendaItems || [],
          actionItems: actionItems || [],
          nextSteps: [], // This field isn't in the database, initialize as empty
          legalReferences: legalRefs || [],
          tags: [], // This field isn't in the database, initialize as empty
        };
      }));

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