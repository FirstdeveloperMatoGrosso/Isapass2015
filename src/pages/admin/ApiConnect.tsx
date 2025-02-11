
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";

const ApiConnectPage = () => {
  const [appName, setAppName] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [apiUrl, setApiUrl] = useState("");

  const generateToken = () => {
    if (!appName) {
      toast.error("Digite o nome do aplicativo");
      return;
    }

    // Gera um token aleatório de 32 caracteres
    const token = Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    
    setApiToken(token);
    setApiUrl(`https://api.isapass.com/v1/${appName.toLowerCase().replace(/\s+/g, '-')}`);
    
    toast.success("Token gerado com sucesso!");
  };

  const copyToClipboard = (text: string, type: "token" | "url") => {
    navigator.clipboard.writeText(text);
    toast.success(`${type === "token" ? "Token" : "URL"} copiado para a área de transferência`);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">API Connect</h2>
        <p className="text-muted-foreground">
          Gerencie conexões de API para seus aplicativos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gerar Nova Conexão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appName">Nome do Aplicativo</Label>
              <Input
                id="appName"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="Ex: Meu Aplicativo"
              />
            </div>

            <Button onClick={generateToken} className="w-full">
              Gerar Token
            </Button>

            {apiToken && (
              <>
                <div className="space-y-2">
                  <Label>Token de API</Label>
                  <div className="flex gap-2">
                    <Input value={apiToken} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(apiToken, "token")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>URL da API</Label>
                  <div className="flex gap-2">
                    <Input value={apiUrl} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(apiUrl, "url")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instruções de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para conectar seu aplicativo à nossa API, siga os passos abaixo:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Digite o nome do seu aplicativo</li>
              <li>Clique em "Gerar Token" para criar um novo token de acesso</li>
              <li>Copie o token e a URL gerados</li>
              <li>Use o token no cabeçalho de suas requisições como "Authorization: Bearer {`{token}`}"</li>
              <li>Use a URL base fornecida para todas as chamadas à API</li>
            </ol>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Exemplo de chamada à API:</p>
              <pre className="text-xs mt-2 bg-background p-2 rounded">
                {`fetch('https://api.isapass.com/v1/seu-app', {
  headers: {
    'Authorization': 'Bearer seu-token'
  }
})`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiConnectPage;
