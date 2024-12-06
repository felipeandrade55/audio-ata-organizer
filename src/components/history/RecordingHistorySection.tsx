import { DateRangeFilter } from "../filters/DateRangeFilter";
import { RecordingHistory } from "../recording/RecordingHistory";

interface RecordingHistorySectionProps {
  recordingDateRange: string;
  setRecordingDateRange: (value: string) => void;
}

export const RecordingHistorySection = ({
  recordingDateRange,
  setRecordingDateRange
}: RecordingHistorySectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Histórico de Gravações
        </h3>
        <DateRangeFilter 
          value={recordingDateRange} 
          onValueChange={setRecordingDateRange} 
        />
      </div>
      <RecordingHistory />
    </div>
  );
};