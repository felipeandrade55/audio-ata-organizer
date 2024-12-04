import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [transcription, setTranscription] = useState("");
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
          // Convert audio to ArrayBuffer
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioContext = new AudioContext({ sampleRate: 16000 });
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          // Get audio data as Float32Array
          const audioData = audioBuffer.getChannelData(0);
          
          // Create FormData and append audio file
          const formData = new FormData();
          formData.append('file', audioBlob, 'audio.wav');
          formData.append('model', 'whisper-1');
          formData.append('language', 'pt');

          // Make request to OpenAI API
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
          setTranscription(result.text);
          
          toast({
            title: "Transcrição concluída",
            description: "O texto da reunião está pronto.",
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

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Ata de Reunião</CardTitle>
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