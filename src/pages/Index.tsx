import AuthForm from "@/components/auth/AuthForm";
import RecordingContainer from "@/components/recording/RecordingContainer";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
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
    <div className="container mx-auto py-8">
      {user ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-card p-4 rounded-lg shadow">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
          <RecordingContainer />
        </div>
      ) : (
        <AuthForm />
      )}
    </div>
  );
};

export default Index;