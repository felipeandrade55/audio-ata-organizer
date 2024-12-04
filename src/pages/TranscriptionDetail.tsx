import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TranscriptionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { segments, date } = location.state;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>
          <CardTitle>Ata de Reunião - {date}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Horário</TableHead>
                <TableHead>Participante</TableHead>
                <TableHead>Fala</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((segment: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{segment.timestamp}</TableCell>
                  <TableCell>{segment.speaker}</TableCell>
                  <TableCell>{segment.text}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranscriptionDetail;