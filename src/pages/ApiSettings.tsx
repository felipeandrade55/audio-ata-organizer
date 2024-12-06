import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ApiSettings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [openaiKey, setOpenaiKey] = useState("");
  const [googleKey, setGoogleKey] = useState("");

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedOpenaiKey = localStorage.getItem("openai_api_key") || "";
    const savedGoogleKey = localStorage.getItem("google_api_key") || "";
    setOpenaiKey(savedOpenaiKey);
    setGoogleKey(savedGoogleKey);
  }, []);

  const handleSave = () => {
    // Save API keys to localStorage
    localStorage.setItem("openai_api_key", openaiKey);
    localStorage.setItem("google_api_key", googleKey);

    toast({
      title: "Configurações salvas",
      description: "As chaves de API foram salvas com sucesso.",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações de API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="openai">Chave da API OpenAI</Label>
            <Input
              id="openai"
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="google">Chave da API Google Cloud</Label>
            <Input
              id="google"
              type="password"
              value={googleKey}
              onChange={(e) => setGoogleKey(e.target.value)}
              placeholder="Insira sua chave da API Google Cloud"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiSettings;