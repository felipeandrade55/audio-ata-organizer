import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface RecordingHeaderProps {
  date: string;
}

const RecordingHeader = ({ date }: RecordingHeaderProps) => {
  return (
    <CardHeader className="space-y-2">
      <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
        Ata de Reunião
      </CardTitle>
      <p className="text-center text-gray-500 dark:text-gray-400">
        {date}
      </p>
    </CardHeader>
  );
};

export default RecordingHeader;