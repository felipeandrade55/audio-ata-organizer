import { useEffect, useRef } from "react";

interface AudioWaveformProps {
  isRecording: boolean;
  isPaused: boolean;
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  systemAnalyser: AnalyserNode | null;
}

const AudioWaveform = ({ 
  isRecording, 
  isPaused, 
  audioContext, 
  analyser,
  systemAnalyser 
}: AudioWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioContext || !analyser || !isRecording || isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      // Get microphone data
      const micDataArray = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatTimeDomainData(micDataArray);

      // Get system audio data if available
      let systemDataArray = new Float32Array(analyser.frequencyBinCount);
      if (systemAnalyser) {
        systemAnalyser.getFloatTimeDomainData(systemDataArray);
      }

      // Clear canvas
      ctx.fillStyle = "rgb(20, 20, 20)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw microphone waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#10b981"; // Emerald color for mic
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / micDataArray.length;
      let x = 0;

      for (let i = 0; i < micDataArray.length; i++) {
        const v = micDataArray[i];
        const y = (v + 1) / 2 * canvas.height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Draw system audio waveform if available
      if (systemAnalyser) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#3b82f6"; // Blue color for system audio
        ctx.beginPath();
        x = 0;

        for (let i = 0; i < systemDataArray.length; i++) {
          const v = systemDataArray[i];
          const y = (v + 1) / 2 * canvas.height;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, isPaused, audioContext, analyser, systemAnalyser]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-900 rounded-lg p-2 mb-4 shadow-lg">
      <canvas
        ref={canvasRef}
        width={600}
        height={100}
        className="w-full h-[100px] rounded"
      />
    </div>
  );
};

export default AudioWaveform;