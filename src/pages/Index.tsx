import RecordingContainer from "@/components/recording/RecordingContainer";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mic, Star, Triangle, Circle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import AuthForm from "@/components/auth/AuthForm";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MeetingMinutes } from "@/types/meeting";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { RecordingHistory } from "@/components/recording/RecordingHistory";

const Index = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [minutes, setMinutes] = useState<MeetingMinutes[]>([]);

  useEffect(() => {
    if (user) {
      fetchMinutes();
    }
  }, [user]);

  const fetchMinutes = async () => {
    try {
      const { data, error } = await supabase
        .from('meeting_minutes')
        .select(`
          id,
          date,
          start_time,
          end_time,
          location,
          meeting_title,
          organizer,
          summary,
          author,
          approver,
          meeting_type,
          confidentiality_level,
          version,
          status,
          last_modified,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match the MeetingMinutes interface
      const transformedData = data?.map(item => ({
        ...item,
        id: item.id,
        meetingTitle: item.meeting_title,
        startTime: item.start_time,
        endTime: item.end_time,
        confidentialityLevel: item.confidentiality_level,
        lastModified: item.last_modified,
        meetingType: item.meeting_type || 'other',
        participants: [], // These will be loaded separately if needed
        agendaItems: [], // These will be loaded separately if needed
        actionItems: [], // These will be loaded separately if needed
        nextSteps: [], // This might need to be added to the database if required
        legalReferences: [], // These will be loaded separately if needed
        tags: [], // This might need to be added to the database if required
      })) || [];

      setMinutes(transformedData);
    } catch (error) {
      console.error('Erro ao buscar atas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as atas.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado com sucesso",
      description: "Até logo!",
    });
  };

  const handleMinuteClick = (minute: MeetingMinutes) => {
    navigate('/transcription', { 
      state: { 
        minutes: minute,
        date: minute.date,
        segments: [] // Você pode adicionar os segmentos se necessário
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-20 right-20 text-purple-600 dark:text-purple-400"
      >
        <Star className="w-24 h-24" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-20 left-20 text-indigo-600 dark:text-indigo-400"
      >
        <Triangle className="w-16 h-16" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 0.1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute top-40 left-40 text-blue-600 dark:text-blue-400"
      >
        <Circle className="w-20 h-20" />
      </motion.div>

      <div className="container mx-auto py-8 px-4 relative z-10">
        {user ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-center p-6 space-y-4 sm:space-y-0">
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full"
                  >
                    <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Bem-vindo(a)</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{user.email}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ProfileSettings />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full"
                  >
                    <Mic className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Sistema de Gravação
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Grave e transcreva suas reuniões com facilidade
                    </p>
                  </div>
                </motion.div>
                <RecordingContainer />
                <RecordingHistory />
              </div>

              {/* Seção de Atas */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Suas Atas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {minutes.map((minute) => (
                    <motion.div
                      key={minute.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() => handleMinuteClick(minute)}
                    >
                      <Card className="p-4 hover:shadow-lg transition-shadow">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {minute.meetingTitle}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {minute.date} - {minute.startTime}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                          {minute.summary || "Sem resumo disponível"}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
              >
                Bem-vindo(a)
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-gray-600 dark:text-gray-300"
              >
                Faça login para começar a gravar e transcrever suas reuniões
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6"
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