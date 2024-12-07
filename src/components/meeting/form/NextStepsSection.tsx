import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface NextStepsSectionProps {
  nextSteps: string[];
  onAddNextStep: () => void;
  onRemoveNextStep: (index: number) => void;
  onUpdateNextStep: (index: number, value: string) => void;
}

export const NextStepsSection = ({
  nextSteps,
  onAddNextStep,
  onRemoveNextStep,
  onUpdateNextStep,
}: NextStepsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Próximos Passos</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAddNextStep}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Passo
        </Button>
      </div>
      {nextSteps.map((step, index) => (
        <div key={index} className="flex gap-4 items-start">
          <Input
            value={step}
            onChange={(e) => onUpdateNextStep(index, e.target.value)}
            placeholder="Próximo passo"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemoveNextStep(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};