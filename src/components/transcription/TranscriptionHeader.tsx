import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardTitle } from "@/components/ui/card";
import { ChevronLeft, Download, Edit2, Save } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface TranscriptionHeaderProps {
  date: string;
  onExportTxt: () => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
  onBack: () => void;
}

const TranscriptionHeader = ({
  date: initialDate,
  onExportTxt,
  onExportPdf,
  onExportExcel,
  onBack,
}: TranscriptionHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState(initialDate);
  const [editingDate, setEditingDate] = useState(initialDate);
  const { toast } = useToast();

  const handleSave = () => {
    setDate(editingDate);
    setIsEditing(false);
    toast({
      title: "Nome atualizado",
      description: "O nome da ata foi atualizado com sucesso.",
    });
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Button>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editingDate}
              onChange={(e) => setEditingDate(e.target.value)}
              className="w-[200px]"
            />
            <Button size="sm" variant="ghost" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CardTitle>Ata de Reunião - {date}</CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onExportTxt}>
            Exportar como TXT
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportPdf}>
            Exportar como PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportExcel}>
            Exportar como Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TranscriptionHeader;