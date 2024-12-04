import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TranscriptionSegment } from "@/types/transcription";
import { voiceIdentificationService } from "@/services/voiceIdentificationService";
import { playIdentificationPrompt } from "@/services/audioService";

export const useRecording = (apiKey: string) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [transcriptionSegments, setTranscriptionSegments] = useState<TranscriptionSegment[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const extractNameFromText = (text: string): string | null => {
    // Procura por padrões comuns de menção de nome
    const patterns = [
      /meu nome[^\w]*(é|eh)[^\w]*([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/i,
      /me chamo[^\w]*([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/i,
      /sou[^\w]*([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[match.length - 1]) {
        return match[match.length - 1].trim();
      }
    }
    return null;
  };

  const startRecording = async (identificationEnabled: boolean) => {
    if (!apiKey) {
      toast({
        title: "Erro",
        description: "Por favor, insira sua chave da API OpenAI primeiro.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (identificationEnabled) {
        voiceIdentificationService.clear();
        await playIdentificationPrompt();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
        } 
      });
      
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      // Inicializa o reconhecimento de fala
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const name = extractNameFromText(transcript);
          
          if (name) {
            voiceIdentificationService.addProfile(name, new Float32Array(0)); // Simplificado para exemplo
            toast({
              title: "Nome identificado",
              description: `Identificamos o participante: ${name}`,
            });
          }
        }
      };

      recognition.start();
      setSpeechRecognition(recognition);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
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
          
          const segments = result.segments.map((segment: any) => {
            const audioFeatures = new Float32Array(segment.tokens.length);
            const speaker = voiceIdentificationService.identifyMostSimilarSpeaker(audioFeatures);

            return {
              speaker,
              text: segment.text,
              timestamp: new Date(segment.start * 1000).toISOString().substr(11, 8)
            };
          });

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

      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setIsPaused(false);
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
      if (speechRecognition) {
        speechRecognition.stop();
      }
      setIsRecording(false);
      setIsPaused(false);
      setMediaRecorder(null);
      setSpeechRecognition(null);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      if (speechRecognition) {
        speechRecognition.stop();
      }
      setIsPaused(true);
      toast({
        title: "Gravação pausada",
        description: "A gravação foi pausada. Clique em retomar para continuar.",
      });
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      if (speechRecognition) {
        speechRecognition.start();
      }
      setIsPaused(false);
      toast({
        title: "Gravação retomada",
        description: "A gravação foi retomada.",
      });
    }
  };

  return {
    isRecording,
    isPaused,
    isTranscribing,
    transcriptionSegments,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
};