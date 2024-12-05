import { MeetingMinutes } from "@/types/meeting";
import MeetingVersionHistory from "../meeting/MeetingVersionHistory";
import MeetingComments from "../meeting/MeetingComments";
import MeetingApprovalWorkflow from "../meeting/MeetingApprovalWorkflow";
import MeetingSharing from "../meeting/MeetingSharing";

interface TranscriptionMetadataProps {
  versions: Array<{
    id: string;
    date: string;
    author: string;
    changes: string;
    minutes: MeetingMinutes;
  }>;
  comments: Array<{
    id: string;
    author: string;
    date: string;
    content: string;
  }>;
  approvers: Array<{
    name: string;
    role: string;
    status: "pending" | "approved" | "rejected";
  }>;
  onRestoreVersion: (version: TranscriptionMetadataProps["versions"][0]) => void;
  onAddComment: (content: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onShareEmail: (email: string) => void;
  onAddToCalendar: () => void;
}

export const TranscriptionMetadata = ({
  versions,
  comments,
  approvers,
  onRestoreVersion,
  onAddComment,
  onApprove,
  onReject,
  onShareEmail,
  onAddToCalendar,
}: TranscriptionMetadataProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="space-y-4">
        <MeetingVersionHistory
          versions={versions.map(v => ({
            id: v.id,
            date: v.date,
            author: v.author,
            changes: v.changes
          }))}
          onRestore={onRestoreVersion}
        />
        <MeetingComments
          comments={comments}
          onAddComment={onAddComment}
        />
      </div>
      <div className="space-y-4">
        <MeetingApprovalWorkflow
          approvers={approvers}
          onApprove={onApprove}
          onReject={onReject}
        />
        <MeetingSharing
          meetingId="123"
          onShareEmail={onShareEmail}
          onAddToCalendar={onAddToCalendar}
        />
      </div>
    </div>
  );
};