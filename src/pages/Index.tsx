import { useSupabase } from "@/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, User, Mic, Calendar, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import AuthForm from "@/components/auth/AuthForm";
import { motion } from "framer-motion";
import RecordingContainer from "@/components/recording/RecordingContainer";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { RecordingHistory } from "@/components/recording/RecordingHistory";
import { MeetingsList } from "@/components/meeting/MeetingsList";
import { useMeetings } from "@/hooks/useMeetings";
import { SettingsMenu } from "@/components/settings/SettingsMenu";
import { useState } from "react";

const Index = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const { data: minutes, isLoading, error } = useMeetings(user?.id || "");

  // Filters state
  const [meetingSearch, setMeetingSearch] = useState("");
  const [meetingType, setMeetingType] = useState<string>("");
  const [recordingDateRange, setRecordingDateRange] = useState<string>("");

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
    const matchesType = !meetingType || minute.meetingType === meetingType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-50 dark:from-gray-900 dark:to-emerald-900">
      <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
        {user ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-6"
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

              {/* Recording Section */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <RecordingContainer />

                {/* History Sections Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recording History Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Histórico de Gravações
                      </h3>
                      <Select
                        value={recordingDateRange}
                        onValueChange={setRecordingDateRange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filtrar por período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Hoje</SelectItem>
                          <SelectItem value="week">Última semana</SelectItem>
                          <SelectItem value="month">Último mês</SelectItem>
                          <SelectItem value="all">Todos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <RecordingHistory />
                  </div>

                  {/* Meeting Minutes History Section */}
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          Histórico de Atas
                        </h3>
                        <Select
                          value={meetingType}
                          onValueChange={setMeetingType}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Tipo de reunião" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todos</SelectItem>
                            <SelectItem value="initial">Inicial</SelectItem>
                            <SelectItem value="followup">Acompanhamento</SelectItem>
                            <SelectItem value="review">Revisão</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          type="text"
                          placeholder="Buscar por título ou conteúdo..."
                          value={meetingSearch}
                          onChange={(e) => setMeetingSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    {isLoading ? (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto mb-3" />
                        Carregando suas atas...
                      </div>
                    ) : error ? (
                      <div className="p-6 text-center text-red-500">
                        Erro ao carregar atas: {error.message}
                      </div>
                    ) : (
                      <MeetingsList minutes={filteredMinutes || []} />
                    )}
                  </div>
                </div>
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
