
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const TicketsApiPage = () => {
  const [apiConfig, setApiConfig] = useState({
    apiKey: '',
    apiSecret: '',
    apiEndpoint: ''
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('ticketsApiConfig');
    if (savedConfig) {
      setApiConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSaveConfig = () => {
    localStorage.setItem('ticketsApiConfig', JSON.stringify(apiConfig));
    toast.success("Configurações da API de Ingressos salvas com sucesso!");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">API de Ingressos</h2>
        <p className="text-muted-foreground">
          Configure as credenciais da API de Ingressos para integração com outros sistemas
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
            A API de Ingressos permite integrar o sistema de venda e validação de ingressos com outras plataformas. 
            Utilize as credenciais acima para autenticar suas requisições.
          </p>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Endpoints Disponíveis:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>GET /tickets - Lista todos os ingressos</li>
              <li>POST /tickets - Cria um novo ingresso</li>
              <li>GET /tickets/:id - Obtém detalhes de um ingresso</li>
              <li>PUT /tickets/:id - Atualiza um ingresso</li>
              <li>DELETE /tickets/:id - Remove um ingresso</li>
              <li>POST /tickets/:id/validate - Valida um ingresso</li>
              <li>GET /events - Lista todos os eventos</li>
              <li>GET /events/:id/tickets - Lista ingressos de um evento</li>
            </ul>
          </div>

          <div className="space-y-2 mt-4">
            <h3 className="font-semibold">Exemplo de Requisição:</h3>
            <pre className="bg-muted p-4 rounded-lg text-xs">
{`// Listar todos os ingressos
fetch('https://api.exemplo.com/v1/tickets', {
  headers: {
    'Authorization': 'Bearer sua-chave-api',
    'Content-Type': 'application/json'
  }
});

// Criar novo ingresso
fetch('https://api.exemplo.com/v1/tickets', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sua-chave-api',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    eventId: '123',
    type: 'vip',
    price: 100.00
  })
});`}
            </pre>
          </div>

          <div className="space-y-2 mt-4">
            <h3 className="font-semibold">Rate Limits:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Plano Básico: 1000 requisições/hora</li>
              <li>Plano Pro: 10000 requisições/hora</li>
              <li>Plano Enterprise: Ilimitado</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketsApiPage;
