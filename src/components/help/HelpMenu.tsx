import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { HelpCircle, BookOpen, AlertTriangle, Save, Edit2, Clock, FileText, Scale, Lock, Handshake, UserCog, CalendarDays, Pencil, Lightbulb } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function HelpMenu() {
  const triggers = [
    {
      type: "task",
      icon: <Edit2 className="h-4 w-4 text-blue-500" />,
      examples: ["vamos criar uma tarefa", "precisamos fazer", "fica pendente", "tarefa", "providenciar", "encaminhar"],
      description: "Cria uma nova tarefa no sistema"
    },
    {
      type: "reminder",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
      examples: ["precisamos lembrar", "não podemos esquecer", "importante lembrar", "lembrete", "atentar para"],
      description: "Adiciona um lembrete importante"
    },
    {
      type: "decision",
      icon: <Save className="h-4 w-4 text-green-500" />,
      examples: ["ficou decidido que", "a decisão é", "decidimos que", "acordamos que", "definimos que"],
      description: "Registra uma decisão tomada"
    },
    {
      type: "highlight",
      icon: <Lightbulb className="h-4 w-4 text-purple-500" />,
      examples: ["isso é muito importante", "destaque para", "importante", "fundamental", "essencial"],
      description: "Destaca informações relevantes"
    },
    {
      type: "deadline",
      icon: <Clock className="h-4 w-4 text-orange-500" />,
      examples: ["prazo é", "vence em", "data limite", "até o dia", "prescreve em"],
      description: "Define prazos importantes"
    },
    {
      type: "document",
      icon: <FileText className="h-4 w-4 text-cyan-500" />,
      examples: ["precisamos do documento", "anexar", "documentação necessária", "preparar documento", "protocolar"],
      description: "Gerencia documentos necessários"
    },
    {
      type: "legal",
      icon: <Scale className="h-4 w-4 text-indigo-500" />,
      examples: ["base legal", "fundamento jurídico", "lei aplicável", "jurisprudência", "súmula"],
      description: "Registra referências legais"
    },
    {
      type: "confidential",
      icon: <Lock className="h-4 w-4 text-rose-500" />,
      examples: ["informação confidencial", "sigilo", "não divulgar", "protegido por sigilo", "segredo de justiça"],
      description: "Marca informações confidenciais"
    },
    {
      type: "agreement",
      icon: <Handshake className="h-4 w-4 text-emerald-500" />,
      examples: ["as partes concordaram", "acordo firmado", "termos aceitos", "consenso sobre", "transação"],
      description: "Registra acordos estabelecidos"
    },
    {
      type: "followup",
      icon: <UserCog className="h-4 w-4 text-violet-500" />,
      examples: ["cliente deve apresentar", "trazer na próxima reunião", "pendente de documentação", "aguardando cliente"],
      description: "Registra pendências do cliente"
    },
    {
      type: "schedule",
      icon: <CalendarDays className="h-4 w-4 text-teal-500" />,
      examples: ["vou agendar", "vamos agendar", "agende", "marcar uma"],
      description: "Cria agendamentos"
    },
    {
      type: "note",
      icon: <Pencil className="h-4 w-4 text-amber-500" />,
      examples: ["vamos anotar", "anotei aqui", "anote isso", "registre isso"],
      description: "Adiciona anotações gerais"
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground">
          <HelpCircle className="h-4 w-4" />
          <span>Ajuda</span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Tutorial de Uso do Sistema
          </DialogTitle>
          <DialogDescription>
            Aprenda como utilizar todos os recursos do sistema de forma eficiente
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">Gatilhos do Sistema</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Durante a transcrição, o sistema identifica automaticamente certas palavras-chave e frases que ativam diferentes funcionalidades.
                Abaixo está a lista completa de gatilhos disponíveis:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {triggers.map((trigger) => (
                  <div key={trigger.type} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      {trigger.icon}
                      <h4 className="font-medium capitalize">{trigger.type}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {trigger.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {trigger.examples.map((example, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Como Usar</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">1. Gravação de Reunião</h4>
                  <p className="text-sm text-muted-foreground">
                    Inicie uma nova gravação clicando no botão de gravação. O sistema começará a transcrever automaticamente
                    a reunião e identificará os gatilhos mencionados acima.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">2. Transcrição Automática</h4>
                  <p className="text-sm text-muted-foreground">
                    Durante a transcrição, o sistema identificará automaticamente palavras-chave e frases que ativam os gatilhos.
                    Cada gatilho gerará uma ação específica no sistema.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">3. Revisão e Edição</h4>
                  <p className="text-sm text-muted-foreground">
                    Após a transcrição, você pode revisar e editar o conteúdo, incluindo tarefas, lembretes e outros itens
                    identificados pelos gatilhos.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">4. Organização</h4>
                  <p className="text-sm text-muted-foreground">
                    Utilize as seções de Tarefas, Calendário e outras ferramentas para organizar e acompanhar os itens
                    identificados durante a reunião.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Dicas Importantes</h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  • Fale claramente e use as palavras-chave dos gatilhos quando quiser ativar uma funcionalidade específica.
                </p>
                <p className="text-sm text-muted-foreground">
                  • Revise a transcrição após a reunião para garantir que todos os itens importantes foram capturados corretamente.
                </p>
                <p className="text-sm text-muted-foreground">
                  • Utilize os filtros e ferramentas de busca para encontrar informações específicas nas transcrições anteriores.
                </p>
                <p className="text-sm text-muted-foreground">
                  • Mantenha as configurações de API atualizadas para garantir o funcionamento adequado do sistema.
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}