import { TranscriptionSegment } from "@/types/transcription";
import { voiceIdentificationService } from "./voiceIdentificationService";
import { handleNameRecognition } from "./nameRecognitionService";
import { analyzeEmotions } from "./emotionDetectionService";

export const processTranscriptionResult = async (result: any, audioBlob: Blob, apiKey: string): Promise<TranscriptionSegment[]> => {
  const segments = result.segments.map((segment: any) => {
    const audioFeatures = new Float32Array(segment.tokens.length);
    const timestamp = segment.start * 1000;
    
    const recognizedName = handleNameRecognition(segment.text);
    if (recognizedName) {
      voiceIdentificationService.addProfile(recognizedName, audioFeatures);
    }
    
    const speaker = voiceIdentificationService.identifyMostSimilarSpeaker(audioFeatures, timestamp);
    
    return {
      speaker,
      text: segment.text,
      timestamp: new Date(timestamp).toISOString().substr(11, 8)
    };
  });

  // Analisar emoções
  const emotions = await analyzeEmotions(audioBlob, apiKey);
  
  // Associar emoções aos segmentos correspondentes
  return segments.map(segment => {
    const emotion = emotions.find(e => e.text === segment.text);
    return {
      ...segment,
      emotion: emotion ? {
        type: emotion.emotion,
        confidence: emotion.confidence
      } : undefined
    };
  });
};