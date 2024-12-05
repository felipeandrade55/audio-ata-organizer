import RecordingContainer from "@/components/recording/RecordingContainer";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mic, Star, Triangle, Circle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import AuthForm from "@/components/auth/AuthForm";
import { motion } from "framer-motion";

const Index = () => {
  const { user } = useSupabase();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado com sucesso",
      description: "Até logo!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Elementos decorativos */}
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="w-full sm:w-auto border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
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