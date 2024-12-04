import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { MeetingMinutes } from "@/types/meeting";

interface MeetingMinutesDisplayProps {
  minutes: MeetingMinutes;
}

const MeetingMinutesDisplay = ({ minutes }: MeetingMinutesDisplayProps) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">ATA DE REUNIÃO</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Data</p>
            <p>{minutes.date}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Horário</p>
            <p>{minutes.startTime} - {minutes.endTime}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Local</p>
            <p>{minutes.location}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reunião</p>
            <p>{minutes.meetingTitle}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Organizador</p>
            <p>{minutes.organizer}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">Participantes</h3>
          <ul className="list-disc pl-5 space-y-1">
            {minutes.participants.map((participant, index) => (
              <li key={index}>
                {participant.name} {participant.role && `- ${participant.role}`}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">Pauta da Reunião</h3>
          <ol className="list-decimal pl-5 space-y-1">
            {minutes.agendaItems.map((item, index) => (
              <li key={index}>{item.title}</li>
            ))}
          </ol>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">Discussões e Decisões</h3>
          <div className="space-y-4">
            {minutes.agendaItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <p className="font-semibold">Pauta {index + 1}: {item.title}</p>
                {item.discussion && <p className="text-sm">{item.discussion}</p>}
                {item.responsible && (
                  <p className="text-sm">
                    <span className="font-medium">Responsável:</span> {item.responsible}
                  </p>
                )}
                {item.decision && (
                  <p className="text-sm">
                    <span className="font-medium">Decisão:</span> {item.decision}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">Ações Definidas</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarefa</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Prazo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {minutes.actionItems.map((action, index) => (
                <TableRow key={index}>
                  <TableCell>{action.task}</TableCell>
                  <TableCell>{action.responsible}</TableCell>
                  <TableCell>{action.deadline}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">Resumo da Reunião</h3>
          <p className="text-sm">{minutes.summary}</p>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-2">Próximos Passos</h3>
          <ol className="list-decimal pl-5 space-y-1">
            {minutes.nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Elaborado por</p>
            <p>{minutes.author}</p>
          </div>
          {minutes.approver && (
            <div>
              <p className="text-sm text-muted-foreground">Aprovado por</p>
              <p>{minutes.approver}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingMinutesDisplay;