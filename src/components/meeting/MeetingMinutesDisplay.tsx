import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MeetingMinutes } from "@/types/meeting";
import { motion } from "framer-motion";
import MinutesHeader from "./MinutesHeader";
import MeetingInfoCard from "./MeetingInfoCard";
import ParticipantsList from "./ParticipantsList";
import AgendaItems from "./AgendaItems";
import ActionItemsTable from "./ActionItemsTable";
import MeetingSummary from "./MeetingSummary";
import MeetingFooter from "./MeetingFooter";
import { AudioReanalysisDialog } from "./AudioReanalysisDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <ScrollArea className="h-[calc(100vh-2rem)] rounded-lg">
          <div className="px-6 pt-4">
            <MinutesHeader
              title={minutes.meetingTitle}
              date={minutes.date}
              time={`${minutes.startTime} - ${minutes.endTime}`}
              location={minutes.location}
              status="draft"
            />
            
            <div className="mt-4">
              <AudioReanalysisDialog 
                meetingId={minutes.id} 
                onAnalysisComplete={() => onUpdate?.()}
              />
            </div>
          </div>

          <CardContent className="space-y-8 p-6">
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
        </ScrollArea>
      </Card>
    </motion.div>
  );
};

export default MeetingMinutesDisplay;