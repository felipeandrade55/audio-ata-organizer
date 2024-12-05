import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Mail, QrCode, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { QRCodeSVG } from "qrcode.react"; // Changed this line to use named import

interface MeetingSharingProps {
  meetingId: string;
  onShareEmail: (email: string) => void;
  onAddToCalendar: () => void;
}

const MeetingSharing = ({
  meetingId,
  onShareEmail,
  onAddToCalendar,
}: MeetingSharingProps) => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const shareUrl = `${window.location.origin}/meeting/${meetingId}`;

  const handleShareEmail = () => {
    if (!email) return;
    onShareEmail(email);
    setEmail("");
    toast({
      title: "Email enviado",
      description: "A ATA foi compartilhada por email com sucesso.",
    });
  };

  const handleAddToCalendar = () => {
    onAddToCalendar();
    toast({
      title: "Evento adicionado",
      description: "O evento foi adicionado ao seu calendário.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Share2 className="h-4 w-4" />
        <CardTitle className="text-lg">Compartilhar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite um email para compartilhar"
            type="email"
          />
          <Button onClick={handleShareEmail} size="icon">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={handleAddToCalendar}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Adicionar ao Calendário
        </Button>

        <div className="border rounded-lg p-4 flex flex-col items-center gap-2">
          <QrCode className="h-4 w-4" />
          <QRCodeSVG value={shareUrl} size={128} />
          <p className="text-sm text-muted-foreground text-center">
            Escaneie para acessar a ATA
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingSharing;