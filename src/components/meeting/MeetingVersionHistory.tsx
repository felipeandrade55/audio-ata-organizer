import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

interface Version {
  id: string;
  date: string;
  author: string;
  changes: string;
}

interface MeetingVersionHistoryProps {
  versions: Version[];
}

const MeetingVersionHistory = ({ versions }: MeetingVersionHistoryProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <History className="h-4 w-4" />
        <CardTitle className="text-lg">Histórico de Versões</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {versions.map((version) => (
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
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MeetingVersionHistory;