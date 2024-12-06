import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings, DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/api-settings" className="w-full cursor-pointer">
                Configurar APIs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/billing" className="w-full cursor-pointer flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Planos e Preços
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>
          <p>Configurações</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};