import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MeetingMinutes } from "@/types/meeting";
import { Calendar, Clock, MapPin, FileText } from "lucide-react";
import { motion } from "framer-motion";
import MeetingHeader from "./MeetingHeader";
import MeetingInfoCard from "./MeetingInfoCard";
import ParticipantsList from "./ParticipantsList";
import AgendaItems from "./AgendaItems";
import ActionItemsTable from "./ActionItemsTable";
import MeetingSummary from "./MeetingSummary";
import MeetingFooter from "./MeetingFooter";
import { AudioReanalysisDialog } from "./AudioReanalysisDialog";

interface MeetingMinutesDisplayProps {
  minutes: MeetingMinutes;
  onUpdate?: () => void;
}

const MeetingMinutesDisplay = ({ minutes, onUpdate }: MeetingMinutesDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <Card className="w-full max-w-5xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
        <MeetingHeader />
        <div className="px-6 pt-4">
          <AudioReanalysisDialog 
            meetingId={minutes.id} 
            onAnalysisComplete={() => onUpdate?.()}
          />
        </div>
        <CardContent className="space-y-8 p-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MeetingInfoCard
              icon={Calendar}
              title="Data"
              value={minutes.date}
              color="text-purple-500"
            />
            <MeetingInfoCard
              icon={Clock}
              title="Horário"
              value={`${minutes.startTime} - ${minutes.endTime}`}
              color="text-blue-500"
            />
            <MeetingInfoCard
              icon={MapPin}
              title="Local"
              value={minutes.location}
              color="text-green-500"
            />
            <MeetingInfoCard
              icon={FileText}
              title="Reunião"
              value={minutes.meetingTitle}
              color="text-orange-500"
            />
          </div>

          <Separator className="my-8" />
          
          <ParticipantsList participants={minutes.participants} />
          
          <Separator className="my-8" />
          
          <AgendaItems agendaItems={minutes.agendaItems} />
          
          <Separator className="my-8" />
          
          <ActionItemsTable actionItems={minutes.actionItems} />
          
          <Separator className="my-8" />
          
          <MeetingSummary 
            summary={minutes.summary}
            nextSteps={minutes.nextSteps}
          />
          
          <Separator className="my-8" />
          
          <MeetingFooter 
            author={minutes.author}
            approver={minutes.approver}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MeetingMinutesDisplay;