import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Clock,
  FileText,
  Scale,
  Lightbulb,
  Users,
  AlertTriangle,
} from "lucide-react";

interface AIAnalysisPanelProps {
  analysis: any;
  isLoading: boolean;
}

export const AIAnalysisPanel = ({ analysis, isLoading }: AIAnalysisPanelProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[150px] w-full" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Brain className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>Nenhuma análise disponível</p>
      </div>
    );
  }

  const getSentimentVariant = (type: string) => {
    switch (type) {
      case 'positive':
        return 'default';
      case 'negative':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-6 p-4">
        {/* Análise de Sentimentos */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Análise de Sentimentos
          </h3>
          <div className="space-y-2">
            {analysis.sentiment.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span>{item.context}</span>
                <Badge variant={getSentimentVariant(item.type)}>
                  {item.type} ({Math.round(item.confidence * 100)}%)
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Resumo */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Resumo
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Tópicos Principais</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.summary.topics.map((topic: string, index: number) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Decisões Principais</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.summary.mainDecisions.map((decision: string, index: number) => (
                  <li key={index}>{decision}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Participação */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Análise de Participação
          </h3>
          <div className="space-y-2">
            {analysis.participation.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span>{item.speaker}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    <Clock className="h-4 w-4 mr-1" />
                    {Math.round(item.timeSpoken / 60)}min
                  </Badge>
                  <Badge variant="outline">
                    {item.interventions} intervenções
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Contexto Legal */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Scale className="h-5 w-5 mr-2" />
            Contexto Legal
          </h3>
          <div className="space-y-4">
            {analysis.legalContext.terms.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Termos Legais Identificados</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.legalContext.terms.map((term: string, index: number) => (
                    <Badge key={index} variant="outline">{term}</Badge>
                  ))}
                </div>
              </div>
            )}
            {analysis.legalContext.implications.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Implicações Legais</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.legalContext.implications.map((imp: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground">{imp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* Sugestões */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Sugestões Contextuais
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Próximos Passos Sugeridos</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.suggestions.nextSteps.map((step: string, index: number) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
            {analysis.suggestions.relatedDocuments.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Documentos Relacionados</h4>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.suggestions.relatedDocuments.map((doc: string, index: number) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
};