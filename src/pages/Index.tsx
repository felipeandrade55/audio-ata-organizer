import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface TranscriptionSegment {
  speaker: string;
  text: string;
  timestamp: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [transcriptionSegments, setTranscriptionSegments] = useState<TranscriptionSegment[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const { toast } = useToast();

  const startRecording = async () => {
    if (!apiKey) {
      toast({
        title: "Erro",
        description: "Por favor, insira sua chave da API OpenAI primeiro.",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
        } 
      });
      
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setIsTranscribing(true);
        
        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'audio.wav');
          formData.append('model', 'whisper-1');
          formData.append('language', 'pt');
          formData.append('response_format', 'verbose_json');

          const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Falha na transcrição');
          }

          const result = await response.json();
          
          // Simular identificação de falantes já que a API atual do Whisper não suporta diarização
          const segments = result.segments.map((segment: any, index: number) => ({
            speaker: `Participante ${Math.floor(index % 3) + 1}`,
            text: segment.text,
            timestamp: new Date(segment.start * 1000).toISOString().substr(11, 8)
          }));

          setTranscriptionSegments(segments);
          
          toast({
            title: "Transcrição concluída",
            description: "A ata da reunião está pronta.",
          });
        } catch (error) {
          console.error('Erro na transcrição:', error);
          toast({
            title: "Erro na transcrição",
            description: "Não foi possível transcrever o áudio.",
            variant: "destructive",
          });
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem('openai_api_key', newApiKey);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTotalDuration = () => {
    if (transcriptionSegments.length === 0) return "0:00";
    const lastSegment = transcriptionSegments[transcriptionSegments.length - 1];
    return lastSegment.timestamp;
  };

  const getParticipantCount = () => {
    const uniqueSpeakers = new Set(transcriptionSegments.map(segment => segment.speaker));
    return uniqueSpeakers.size;
  };

  const viewFullTranscription = () => {
    navigate("/transcription", {
      state: {
        segments: transcriptionSegments,
        date: formatDate(new Date())
      }
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Ata de Reunião - {formatDate(new Date())}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="w-full">
              <Input
                type="password"
                placeholder="Insira sua chave da API OpenAI"
                value={apiKey}
                onChange={handleApiKeyChange}
                className="mb-4"
              />
            </div>

            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              onClick={isRecording ? stopRecording : startRecording}
              className="w-full max-w-xs"
              disabled={isTranscribing}
            >
              {isRecording ? (
                <>
                  <Square className="mr-2 h-5 w-5" />
                  Parar Gravação
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-5 w-5" />
                  Iniciar Gravação
                </>
              )}
            </Button>

            {isRecording && (
              <div className="text-center text-red-500 animate-pulse">
                Gravando...
              </div>
            )}

            {isTranscribing && (
              <div className="text-center text-blue-500">
                Transcrevendo o áudio...
              </div>
            )}

            {transcriptionSegments.length > 0 && (
              <Card className="w-full mt-4">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Duração Total</p>
                        <p className="text-lg font-semibold">{getTotalDuration()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Participantes</p>
                        <p className="text-lg font-semibold">{getParticipantCount()}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={viewFullTranscription}
                      className="w-full"
                    >
                      Ver Transcrição Completa
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;