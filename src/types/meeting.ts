export interface MeetingParticipant {
  name: string;
  role?: string;
  oab?: string;  // Número da OAB para advogados
  email?: string;
  phone?: string;
}

export interface AgendaItem {
  title: string;
  discussion?: string;
  responsible?: string;
  decision?: string;
  legalReferences?: string[];  // Referências a leis, jurisprudências, etc.
  confidential?: boolean;  // Marcador para informações sigilosas
  attachments?: string[];  // Documentos anexados
}

export interface ActionItem {
  task: string;
  responsible: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  legalDeadline?: boolean;  // Indica se é um prazo legal/processual
}

export interface LegalReference {
  type: 'lei' | 'jurisprudencia' | 'doutrina' | 'sumula';
  reference: string;
  description: string;
}

export interface MeetingMinutes {
  id: string;  // Added this property
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
  meetingType: 'initial' | 'followup' | 'settlement' | 'preparation' | 'other';
  confidentialityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  legalReferences: LegalReference[];
  version: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'archived';
  lastModified: string;
  tags: string[];
  apiKey?: string;
}