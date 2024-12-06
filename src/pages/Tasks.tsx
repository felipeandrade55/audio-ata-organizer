import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const { user } = useSupabase();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-50 dark:from-gray-900 dark:to-emerald-900 p-4 sm:p-6">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-emerald-100 dark:border-emerald-800 p-4 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Lista de Tarefas
          </h1>
          <KanbanBoard userId={user.id} />
        </div>
      </div>
    </div>
  );
};

export default Tasks;