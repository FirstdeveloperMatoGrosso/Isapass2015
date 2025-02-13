
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const TokensApiPage = () => {
  const [apiConfig, setApiConfig] = useState({
    apiKey: '',
    apiSecret: '',
    apiEndpoint: ''
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('tokensApiConfig');
    if (savedConfig) {
      setApiConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSaveConfig = () => {
    localStorage.setItem('tokensApiConfig', JSON.stringify(apiConfig));
    toast.success("Configurações da API de Fichas salvas com sucesso!");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">API de Fichas</h2>
        <p className="text-muted-foreground">
          Configure as credenciais da API de Fichas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações da API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Chave da API</Label>
            <Input 
              type="password" 
              placeholder="Insira a chave da API"
              value={apiConfig.apiKey}
              onChange={(e) => setApiConfig(prev => ({...prev, apiKey: e.target.value}))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Segredo da API</Label>
            <Input 
              type="password" 
              placeholder="Insira o segredo da API"
              value={apiConfig.apiSecret}
              onChange={(e) => setApiConfig(prev => ({...prev, apiSecret: e.target.value}))}
            />
          </div>

          <div className="space-y-2">
            <Label>Endpoint da API</Label>
            <Input 
              type="text" 
              placeholder="https://api.exemplo.com/v1"
              value={apiConfig.apiEndpoint}
              onChange={(e) => setApiConfig(prev => ({...prev, apiEndpoint: e.target.value}))}
            />
          </div>

          <Button className="w-full" onClick={handleSaveConfig}>
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentação da API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A API de Fichas permite integrar o sistema de fichas com outras plataformas. 
            Utilize as credenciais acima para autenticar suas requisições.
          </p>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Endpoints Disponíveis:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>GET /tokens - Lista todas as fichas</li>
              <li>POST /tokens - Cria uma nova ficha</li>
              <li>GET /tokens/:id - Obtém detalhes de uma ficha</li>
              <li>PUT /tokens/:id - Atualiza uma ficha</li>
              <li>DELETE /tokens/:id - Remove uma ficha</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokensApiPage;
