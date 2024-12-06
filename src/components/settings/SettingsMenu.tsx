import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Key, CreditCard, ListTodo, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

export function SettingsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link to="/api-settings" className="flex items-center">
            <Key className="h-4 w-4 mr-2" />
            Chaves de API
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/billing" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Faturamento
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/tasks" className="flex items-center">
            <ListTodo className="h-4 w-4 mr-2" />
            Tarefas
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/calendar" className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendário
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}