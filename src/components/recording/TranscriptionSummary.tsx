import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface TranscriptionSummaryProps {
  duration: string;
  participantCount: number;
  onViewFullTranscription: () => void;
}

const TranscriptionSummary = ({
  duration,
  participantCount,
  onViewFullTranscription,
}: TranscriptionSummaryProps) => {
  return (
    <Card className="w-full mt-4">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Duração Total</p>
              <p className="text-lg font-semibold">{duration}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Participantes</p>
              <p className="text-lg font-semibold">{participantCount}</p>
            </div>
          </div>
          <Button onClick={onViewFullTranscription} className="w-full">
            Ver Transcrição Completa
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptionSummary;