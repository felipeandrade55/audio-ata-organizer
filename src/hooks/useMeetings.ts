import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { MeetingMinutes } from "@/types/meeting";

export const useMeetings = (userId: string) => {
  console.log("Fetching minutes for user:", userId);

  return useQuery({
    queryKey: ["meetings", userId],
    queryFn: async () => {
      const { data: meetingsData, error } = await supabase
        .from("meeting_minutes")
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
          meeting_type,
          confidentiality_level,
          version,
          status,
          last_modified,
          user_id
        `)
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching meetings:", error);
        throw error;
      }

      console.log("Fetched meetings data:", meetingsData);

      // Transform the data to match the MeetingMinutes interface
      const transformedData: MeetingMinutes[] = meetingsData.map((meeting) => ({
        id: meeting.id,
        date: meeting.date,
        startTime: meeting.start_time,
        endTime: meeting.end_time || '',
        location: meeting.location || 'Virtual - Gravação de Áudio',
        meetingTitle: meeting.meeting_title,
        organizer: meeting.organizer || '',
        participants: [], // Will be fetched separately if needed
        agendaItems: [], // Will be fetched separately if needed
        actionItems: [], // Will be fetched separately if needed
        summary: meeting.summary || '',
        nextSteps: [], // Not in database schema
        author: meeting.author || 'Sistema de Transcrição',
        meetingType: (meeting.meeting_type as MeetingMinutes['meetingType']) || 'initial',
        confidentialityLevel: (meeting.confidentiality_level as MeetingMinutes['confidentialityLevel']) || 'internal',
        legalReferences: [], // Will be fetched separately if needed
        version: meeting.version || 1,
        status: (meeting.status as MeetingMinutes['status']) || 'draft',
        lastModified: meeting.last_modified,
        tags: [], // Not in database schema
      }));

      console.log("Transformed data:", transformedData);
      return transformedData;
    },
    enabled: !!userId,
  });
};