import { useSupabase } from "@/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mic, Calendar, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import AuthForm from "@/components/auth/AuthForm";
import { motion } from "framer-motion";
import RecordingContainer from "@/components/recording/RecordingContainer";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { RecordingHistory } from "@/components/recording/RecordingHistory";
import { MeetingsList } from "@/components/meeting/MeetingsList";
import { useMeetings } from "@/hooks/useMeetings";

const Index = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const { data: minutes, isLoading, error } = useMeetings(user?.id || "");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado com sucesso",
      description: "Até logo!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-50 dark:from-gray-900 dark:to-emerald-900">
      <div className="container mx-auto py-8 px-4">
        {user ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Header Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-800 overflow-hidden"
            >
              {/* User Info Section */}
              <div className="flex flex-col sm:flex-row justify-between items-center p-6 space-y-4 sm:space-y-0 border-b border-emerald-100 dark:border-emerald-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Bem-vindo(a) ao</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Enoque Transcritor</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <ProfileSettings />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-800"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>

              {/* Recording Section */}
              <div className="p-6 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <Mic className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      Enoque Transcritor
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Grave e transcreva suas reuniões com facilidade
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gradient-to-br from-emerald-50/50 to-gray-50/50 dark:from-emerald-900/30 dark:to-gray-800/30 rounded-xl p-6 shadow-lg border border-emerald-100/50 dark:border-emerald-700/30"
                >
                  <RecordingContainer />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <RecordingHistory />
                </motion.div>
              </div>

              {/* Meetings Section */}
              <div className="border-t border-emerald-100 dark:border-emerald-800 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Suas Atas
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Histórico de reuniões e atas
                    </p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-800"
                >
                  {isLoading ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4" />
                      Carregando suas atas...
                    </div>
                  ) : error ? (
                    <div className="p-8 text-center text-red-500">
                      Erro ao carregar atas: {error.message}
                    </div>
                  ) : (
                    <MeetingsList minutes={minutes || []} />
                  )}
                </motion.div>
              </div>
            </motion.div>
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
                Enoque Transcritor
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
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-800 p-6"
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