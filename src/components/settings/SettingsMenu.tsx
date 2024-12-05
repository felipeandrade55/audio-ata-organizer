import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const SettingsMenu = () => {
  const { user } = useSupabase();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      setIsAdmin(profile?.role === 'admin');
    };

    checkAdminStatus();
  }, [user]);

  if (!isAdmin) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={() => {
        // Implementaremos a navegação para a página de configurações posteriormente
        console.log('Settings clicked');
      }}
    >
      <Settings className="h-4 w-4" />
      Configurações
    </Button>
  );
};