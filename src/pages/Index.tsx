import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [transcription, setTranscription] = useState("");
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        // Por enquanto apenas mostramos que a gravação foi finalizada
        // Posteriormente implementaremos a transcrição
        toast({
          title: "Gravação finalizada",
          description: "Em breve implementaremos a transcrição do áudio.",
        });
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

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Ata de Reunião</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              onClick={isRecording ? stopRecording : startRecording}
              className="w-full max-w-xs"
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

            {transcription && (
              <div className="w-full mt-4">
                <h3 className="font-semibold mb-2">Transcrição:</h3>
                <div className="p-4 bg-muted rounded-lg">
                  {transcription}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;