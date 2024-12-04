import { useEffect, useState } from "react";

interface RecordingTimerProps {
  isRecording: boolean;
  isPaused: boolean;
  startTime: number | null;
}

const RecordingTimer = ({ isRecording, isPaused, startTime }: RecordingTimerProps) => {
  const [elapsedTime, setElapsedTime] = useState("00:00");

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRecording && !isPaused && startTime) {
      intervalId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setElapsedTime(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording, isPaused, startTime]);

  return (
    <div className="text-lg font-mono text-gray-700 dark:text-gray-300">
      {elapsedTime}
    </div>
  );
};

export default RecordingTimer;