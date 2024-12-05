import { LegalReference } from "@/types/meeting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface LegalReferencesSectionProps {
  references: LegalReference[];
}

const LegalReferencesSection = ({ references }: LegalReferencesSectionProps) => {
  const getTypeColor = (type: LegalReference['type']) => {
    switch (type) {
      case 'lei':
        return 'bg-blue-100 text-blue-800';
      case 'jurisprudencia':
        return 'bg-green-100 text-green-800';
      case 'doutrina':
        return 'bg-purple-100 text-purple-800';
      case 'sumula':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Referências Legais</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] rounded-md border p-4">
          <div className="space-y-4">
            {references.map((ref, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col space-y-2 p-3 rounded-lg border"
              >
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className={getTypeColor(ref.type)}>
                    {ref.type.toUpperCase()}
                  </Badge>
                  <span className="text-sm font-medium">{ref.reference}</span>
                </div>
                <p className="text-sm text-gray-600">{ref.description}</p>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LegalReferencesSection;