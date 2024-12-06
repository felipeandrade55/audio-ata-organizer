import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { MeetingMinutes } from "@/types/meeting";

export const useMeetings = (userId: string) => {
  console.log("Fetching minutes for user:", userId);

  return useQuery({
    queryKey: ["meetings", userId],
    queryFn: async () => {
      const { data: meetingsData, error } = await supabase
        .from("meeting_minutes")
        .select("*")
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
        endTime: meeting.end_time,
        location: meeting.location,
        meetingTitle: meeting.meeting_title,
        organizer: meeting.organizer,
        participants: [], // Will be fetched separately if needed
        agendaItems: [], // Will be fetched separately if needed
        actionItems: [], // Will be fetched separately if needed
        summary: meeting.summary,
        nextSteps: [], // Not in database schema
        author: meeting.author,
        meetingType: meeting.meeting_type as MeetingMinutes['meetingType'], // Type assertion to match the enum
        confidentialityLevel: meeting.confidentiality_level as MeetingMinutes['confidentialityLevel'],
        legalReferences: [], // Will be fetched separately if needed
        version: meeting.version,
        status: meeting.status as MeetingMinutes['status'],
        lastModified: meeting.last_modified,
        tags: [], // Not in database schema
        userId: meeting.user_id,
      }));

      console.log("Transformed data:", transformedData);
      return transformedData;
    },
    enabled: !!userId,
  });
};