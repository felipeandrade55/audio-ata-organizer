import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const useTranscriptionLimit = () => {
  const { toast } = useToast();

  const checkTranscriptionLimit = useCallback(async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro de Autenticação",
          description: "Você precisa estar logado para gravar transcrições.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Verificando limite para usuário:', user.id);
      const { data, error } = await supabase.rpc('check_transcription_limit', {
        user_uuid: user.id
      });
      
      if (error) {
        console.error('Erro ao verificar limite:', error);
        throw error;
      }
      
      console.log('Resultado da verificação:', data);
      if (data && data[0] && data[0].total_count >= 10) {
        const shouldProceed = window.confirm(
          "Você atingiu o limite de 10 transcrições na versão BETA. A transcrição mais antiga será removida para continuar. Deseja prosseguir?"
        );
        
        if (!shouldProceed) {
          return false;
        }

        // Delete the oldest transcription
        if (data[0].oldest_id) {
          const { error: deleteError } = await supabase
            .from('meeting_minutes')
            .delete()
            .eq('id', data[0].oldest_id);

          if (deleteError) throw deleteError;

          toast({
            title: "Transcrição antiga removida",
            description: "A transcrição mais antiga foi removida para liberar espaço.",
          });
        }
      }
      return true;
    } catch (error) {
      console.error('Erro ao verificar limite de transcrições:', error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar o limite de transcrições.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return { checkTranscriptionLimit };
};