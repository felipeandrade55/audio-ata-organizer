import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Star, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Billing = () => {
  const plans = [
    {
      name: "Starter",
      description: "Ideal para pequenos escritórios e profissionais autônomos",
      features: [
        "Até 5 transcrições por mês",
        "Armazenamento de 1GB",
        "Exportação em PDF",
        "Suporte por email"
      ],
      price: "R$ 49,90",
      icon: <DollarSign className="h-6 w-6 text-emerald-600" />
    },
    {
      name: "Premium",
      description: "Perfeito para escritórios em crescimento",
      features: [
        "Até 20 transcrições por mês",
        "Armazenamento de 5GB",
        "Exportação em PDF e Word",
        "Suporte prioritário",
        "Análise de sentimentos",
        "Identificação de participantes"
      ],
      price: "R$ 99,90",
      icon: <Star className="h-6 w-6 text-emerald-600" />
    },
    {
      name: "Platinum",
      description: "Para grandes escritórios e departamentos jurídicos",
      features: [
        "Transcrições ilimitadas",
        "Armazenamento de 20GB",
        "Todos os formatos de exportação",
        "Suporte 24/7",
        "Análise avançada de dados",
        "API de integração",
        "Treinamento personalizado"
      ],
      price: "R$ 199,90",
      icon: <Star className="h-6 w-6 text-emerald-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-50 dark:from-gray-900 dark:to-emerald-900">
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Beta Alert */}
          <Alert className="bg-emerald-100/80 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800">
            <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <AlertDescription className="text-emerald-800 dark:text-emerald-200">
              O Enoque Transcritor está atualmente em fase BETA e seu uso é totalmente gratuito!
            </AlertDescription>
          </Alert>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Planos e Preços
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Escolha o plano ideal para o seu escritório
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden border-emerald-100 dark:border-emerald-800 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {plan.icon}
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">/mês</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
                      disabled
                    >
                      Em breve
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Billing;