export interface MeetingParticipant {
  name: string;
  role?: string;
}

export interface AgendaItem {
  title: string;
  discussion?: string;
  responsible?: string;
  decision?: string;
}

export interface ActionItem {
  task: string;
  responsible: string;
  deadline: string;
}

export interface MeetingMinutes {
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  meetingTitle: string;
  organizer: string;
  participants: MeetingParticipant[];
  agendaItems: AgendaItem[];
  actionItems: ActionItem[];
  summary: string;
  nextSteps: string[];
  author: string;
  approver?: string;
}