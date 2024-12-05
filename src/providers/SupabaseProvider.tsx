import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface SupabaseContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
  isLoading: true,
});

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase deve ser usado dentro de um SupabaseProvider');
  }
  return context;
};

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Busca a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Configura o listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (_event === 'SIGNED_IN') {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
      }

      if (_event === 'SIGNED_OUT') {
        toast({
          title: "Logout realizado",
          description: "Até logo!",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <SupabaseContext.Provider value={{ user, session, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  );
};