import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Version {
  id: string;
  date: string;
  author: string;
  changes: string;
}

interface MeetingVersionHistoryProps {
  versions: Version[];
  onRestore?: (version: Version) => void;
}

const MeetingVersionHistory = ({ versions, onRestore }: MeetingVersionHistoryProps) => {
  const { toast } = useToast();

  const handleRestore = (version: Version) => {
    if (onRestore) {
      onRestore(version);
      toast({
        title: "Versão restaurada",
        description: `A versão de ${version.date} foi restaurada com sucesso.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <History className="h-4 w-4" />
        <CardTitle className="text-lg">Histórico de Versões</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {versions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma versão anterior encontrada
            </p>
          ) : (
            versions.map((version) => (
              <div
                key={version.id}
                className="mb-4 border-b pb-2 last:border-0 last:pb-0"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{version.date}</span>
                  <span className="text-muted-foreground">{version.author}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {version.changes}
                </p>
                {onRestore && (
                  <button
                    onClick={() => handleRestore(version)}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    Restaurar esta versão
                  </button>
                )}
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MeetingVersionHistory;