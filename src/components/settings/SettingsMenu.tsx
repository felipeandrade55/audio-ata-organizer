import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useToast } from "@/components/ui/use-toast";

export const SettingsMenu = () => {
  const { user } = useSupabase();
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          toast({
            title: "Erro ao verificar permissões",
            description: "Não foi possível verificar suas permissões de administrador.",
            variant: "destructive",
          });
          return;
        }

        setIsAdmin(data?.role === 'admin');
      } catch (error: any) {
        console.error('Error in checkAdminStatus:', error);
        toast({
          title: "Erro ao verificar permissões",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    checkAdminStatus();
  }, [user, toast]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/api-settings" className="w-full cursor-pointer">
            Configurar APIs
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};