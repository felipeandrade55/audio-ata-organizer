import { useSupabase } from "@/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { LogOut, User, ListTodo } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import AuthForm from "@/components/auth/AuthForm";
import { motion } from "framer-motion";
import RecordingContainer from "@/components/recording/RecordingContainer";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { SettingsMenu } from "@/components/settings/SettingsMenu";
import { useState } from "react";
import { useMeetings } from "@/hooks/useMeetings";
import { RecordingHistorySection } from "@/components/history/RecordingHistorySection";
import { MeetingHistorySection } from "@/components/history/MeetingHistorySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const Index = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const { data: minutes, isLoading, error } = useMeetings(user?.id || "");
  console.log("User ID:", user?.id);
  console.log("Minutes data:", minutes);
  console.log("Loading state:", isLoading);
  console.log("Error state:", error);

  // Filters state
  const [meetingSearch, setMeetingSearch] = useState("");
  const [meetingType, setMeetingType] = useState<string>("all");
  const [recordingDateRange, setRecordingDateRange] = useState<string>("all");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado com sucesso",
      description: "Até logo!",
    });
  };

  // Filter meetings based on search and type
  const filteredMinutes = minutes?.filter(minute => {
    const matchesSearch = minute.meetingTitle.toLowerCase().includes(meetingSearch.toLowerCase()) ||
                         minute.summary?.toLowerCase().includes(meetingSearch.toLowerCase());
    const matchesType = meetingType === 'all' || minute.meetingType === meetingType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-50 dark:from-gray-900 dark:to-emerald-900">
      <div className="w-full px-2 py-4 sm:px-4 sm:py-8">
        {user ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6 max-w-[1920px] mx-auto"
          >
            {/* Header Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-800 overflow-hidden"
            >
              {/* User Info Section */}
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 space-y-3 sm:space-y-0 border-b border-emerald-100 dark:border-emerald-800">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Bem-vindo(a) ao</span>
                    <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">Enoque Transcritor</span>
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <Link to="/tasks">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs sm:text-sm border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-800"
                    >
                      <ListTodo className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Tarefas
                    </Button>
                  </Link>
                  <ProfileSettings />
                  <SettingsMenu />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-xs sm:text-sm border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-800"
                  >
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Sair
                  </Button>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-4 sm:p-6">
                <Tabs defaultValue="recording" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="recording">Gravação</TabsTrigger>
                    <TabsTrigger value="history">Histórico</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="recording">
                    <RecordingContainer />
                  </TabsContent>
                  
                  <TabsContent value="history">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <RecordingHistorySection
                        recordingDateRange={recordingDateRange}
                        setRecordingDateRange={setRecordingDateRange}
                      />
                      <MeetingHistorySection
                        meetingSearch={meetingSearch}
                        setMeetingSearch={setMeetingSearch}
                        meetingType={meetingType}
                        setMeetingType={setMeetingType}
                        filteredMinutes={filteredMinutes || []}
                        isLoading={isLoading}
                        error={error}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto px-4 sm:px-0"
          >
            <div className="text-center mb-6 sm:mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2"
              >
                Enoque Transcritor
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-sm sm:text-base text-gray-600 dark:text-gray-300"
              >
                Faça login para começar a gravar e transcrever suas reuniões
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-800 p-4 sm:p-6"
            >
              <AuthForm />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;