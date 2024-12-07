import { Button } from "@/components/ui/button";
import { Share2, RotateCw, Brain, Clock, FileAudio, Tag, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TranscriptionRecord } from "./types";
import { formatFileSize } from "./utils";

interface RecordingCardProps {
  recording: TranscriptionRecord;
  onRetry: (id: string) => void;
  onShare: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  getAudioUrl: (path: string) => string;
}

export const RecordingCard = ({
  recording,
  onRetry,
  onShare,
  isSelected,
  onSelect,
  getAudioUrl
}: RecordingCardProps) => {
  const getAiStatus = () => {
    if (!recording.transcription_text) return "Não processado";
    if (recording.sentiment_analysis || recording.key_moments) return "Análise completa";
    return "Transcrição completa";
  };

  const getEstimatedCompletion = () => {
    if (recording.status === "completed") return null;
    // Estimativa baseada no tamanho do arquivo (2min por MB)
    const sizeInMb = recording.size ? recording.size / (1024 * 1024) : 0;
    const estimatedMinutes = Math.ceil(sizeInMb * 2);
    return `~${estimatedMinutes} minutos`;
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-4 flex-grow">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(recording.id)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">
              {formatDistanceToNow(new Date(recording.created_at), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
            <Badge
              variant={
                recording.status === "error"
                  ? "destructive"
                  : recording.status === "completed"
                  ? "success"
                  : "warning"
              }
            >
              {recording.status === "error"
                ? "Erro"
                : recording.status === "completed"
                ? "Concluído"
                : "Processando"}
            </Badge>
            
            <div className="flex items-center gap-1">
              <FileAudio className="h-3 w-3" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(recording.size)}
              </span>
            </div>

            {recording.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {recording.duration}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {getAiStatus()}
              </span>
            </div>

            {recording.participants_count && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {recording.participants_count} participantes
                </span>
              </div>
            )}

            {recording.tags && recording.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <div className="flex gap-1">
                  {recording.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {recording.confidence && (
              <Badge variant="secondary" className="text-xs">
                Confiança: {Math.round(recording.confidence * 100)}%
              </Badge>
            )}

            {getEstimatedCompletion() && (
              <Badge variant="outline" className="text-xs">
                Conclusão em: {getEstimatedCompletion()}
              </Badge>
            )}
          </div>

          {recording.error_message && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1 truncate">
              {recording.error_message}
            </p>
          )}

          <p className="text-sm text-gray-500 mt-1">
            Arquivo: {recording.original_filename || recording.audio_path.split('/').pop()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <audio
          controls
          className="h-8 max-w-[200px] sm:max-w-none"
          src={getAudioUrl(recording.audio_path)}
        >
          Seu navegador não suporta o elemento de áudio.
        </audio>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShare(recording.id)}
        >
          <Share2 className="h-4 w-4" />
        </Button>

        {recording.status === "error" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRetry(recording.id)}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};