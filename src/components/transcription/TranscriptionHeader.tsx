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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  const handleSave = () => {
    setDate(editingDate);
    setIsEditing(false);
    toast({
      title: "Nome atualizado",
      description: "O nome da ata foi atualizado com sucesso.",
    });
  };

  return (
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-fit px-0 sm:px-4 -ml-2 sm:ml-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-2">Voltar</span>
        </Button>
        
        {isEditing ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              value={editingDate}
              onChange={(e) => setEditingDate(e.target.value)}
              className="w-full sm:w-[200px]"
            />
            <Button size="sm" variant="ghost" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CardTitle className="text-base sm:text-lg">
              {isMobile ? date : `Ata de Reunião - ${date}`}
            </CardTitle>
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
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
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