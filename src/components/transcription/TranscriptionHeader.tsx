import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SettingsMenu } from "@/components/settings/SettingsMenu";

interface TranscriptionHeaderProps {
  date?: string;
  onBack?: () => void;
  onExportTxt?: () => void;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
}

export const TranscriptionHeader = ({
  onBack,
}: TranscriptionHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>
      <SettingsMenu />
    </div>
  );
};