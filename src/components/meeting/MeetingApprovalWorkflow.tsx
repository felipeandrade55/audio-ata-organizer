import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, UserCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Approver {
  name: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  date?: string;
}

interface MeetingApprovalWorkflowProps {
  approvers: Approver[];
  onApprove: () => void;
  onReject: () => void;
}

const MeetingApprovalWorkflow = ({
  approvers,
  onApprove,
  onReject,
}: MeetingApprovalWorkflowProps) => {
  const { toast } = useToast();

  const handleApprove = () => {
    onApprove();
    toast({
      title: "ATA Aprovada",
      description: "A ATA foi aprovada com sucesso.",
    });
  };

  const handleReject = () => {
    onReject();
    toast({
      title: "ATA Rejeitada",
      description: "A ATA foi rejeitada e retornará para revisão.",
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <UserCheck className="h-4 w-4" />
        <CardTitle className="text-lg">Fluxo de Aprovação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {approvers.map((approver, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-2 last:border-0"
            >
              <div>
                <p className="font-medium">{approver.name}</p>
                <p className="text-sm text-muted-foreground">{approver.role}</p>
              </div>
              <div className="flex items-center gap-2">
                {approver.status === "pending" && (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )}
                {approver.status === "approved" && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {approver.date && (
                  <span className="text-sm text-muted-foreground">
                    {approver.date}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleReject}>
            Rejeitar
          </Button>
          <Button onClick={handleApprove}>Aprovar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingApprovalWorkflow;