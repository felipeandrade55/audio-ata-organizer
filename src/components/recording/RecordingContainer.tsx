import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import RecordingHeader from "./RecordingHeader";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useMeetings } from "@/hooks/useMeetings";
import { RecordingHistorySection } from "@/components/history/RecordingHistorySection";
import { MeetingHistorySection } from "@/components/history/MeetingHistorySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecordingMain from "./RecordingMain";

declare global {
  interface Window {
    systemAudioEnabled: boolean;
  }
}

const RecordingContainer = () => {
  const { user } = useSupabase();
  const [transcriptionService, setTranscriptionService] = useState<'openai' | 'google'>('openai');
  const [meetingSearch, setMeetingSearch] = useState("");
  const [meetingType, setMeetingType] = useState<string>("all");
  const [recordingDateRange, setRecordingDateRange] = useState<string>("all");
  
  const { data: minutes, isLoading, error } = useMeetings(user?.id || "");

  // Filter minutes based on search and type
  const filteredMinutes = minutes?.filter(minute => {
    const matchesSearch = minute.meetingTitle.toLowerCase().includes(meetingSearch.toLowerCase()) ||
                         minute.summary?.toLowerCase().includes(meetingSearch.toLowerCase());
    const matchesType = meetingType === 'all' || minute.meetingType === meetingType;
    return matchesSearch && matchesType;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-xl border-0 ring-1 ring-gray-200 dark:ring-gray-800">
          <RecordingHeader date={new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })} />
          <CardContent>
            <div className="space-y-8">
              <RecordingMain
                transcriptionService={transcriptionService}
                onServiceChange={setTranscriptionService}
              />

              <div className="w-full">
                <Tabs defaultValue="recording" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recording">Gravações</TabsTrigger>
                    <TabsTrigger value="minutes">Atas</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="recording" className="mt-4">
                    <RecordingHistorySection
                      recordingDateRange={recordingDateRange}
                      setRecordingDateRange={setRecordingDateRange}
                    />
                  </TabsContent>
                  
                  <TabsContent value="minutes" className="mt-4">
                    <MeetingHistorySection
                      meetingSearch={meetingSearch}
                      setMeetingSearch={setMeetingSearch}
                      meetingType={meetingType}
                      setMeetingType={setMeetingType}
                      filteredMinutes={filteredMinutes}
                      isLoading={isLoading}
                      error={error}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecordingContainer;