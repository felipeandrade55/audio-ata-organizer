import AuthForm from "@/components/auth/AuthForm";
import RecordingContainer from "@/components/recording/RecordingContainer";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mic } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        {user ? (
          <div className="space-y-6">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-center p-6 space-y-4 sm:space-y-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Bem-vindo(a)</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{user.email}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="w-full sm:w-auto border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                    <Mic className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Sistema de Gravação
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Grave e transcreva suas reuniões com facilidade
                    </p>
                  </div>
                </div>
                <RecordingContainer />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Bem-vindo(a)
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Faça login para começar a gravar e transcrever suas reuniões
              </p>
            </div>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <AuthForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;