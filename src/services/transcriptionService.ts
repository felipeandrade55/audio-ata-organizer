import { TranscriptionSegment } from "@/types/transcription";
import { voiceIdentificationService } from "./voiceIdentificationService";
import { handleNameRecognition } from "./nameRecognitionService";

export const processTranscriptionResult = (result: any): TranscriptionSegment[] => {
  return result.segments.map((segment: any) => {
    const audioFeatures = new Float32Array(segment.tokens.length);
    let speaker = voiceIdentificationService.identifyMostSimilarSpeaker(audioFeatures);
    
    // Try to extract name from the segment text
    const recognizedName = handleNameRecognition(segment.text);
    if (recognizedName) {
      speaker = recognizedName;
      voiceIdentificationService.addProfile(recognizedName, audioFeatures);
    }

    return {
      speaker,
      text: segment.text,
      timestamp: new Date(segment.start * 1000).toISOString().substr(11, 8)
    };
  });
};