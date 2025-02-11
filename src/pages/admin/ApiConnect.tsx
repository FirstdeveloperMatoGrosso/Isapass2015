
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Database } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApiConnectPage = () => {
  const [appName, setAppName] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");

  const generateToken = () => {
    if (!appName) {
      toast.error("Digite o nome do aplicativo");
      return;
    }

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

  const handleSupabaseConnect = () => {
    if (!supabaseUrl || !supabaseKey) {
      toast.error("Preencha todos os campos do Supabase");
      return;
    }
    toast.success("Conectado ao Supabase com sucesso!");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">API Connect</h2>
        <p className="text-muted-foreground">
          Gerencie conexões de API para seus aplicativos
        </p>
      </div>

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="api" className="w-full">API Própria</TabsTrigger>
          <TabsTrigger value="supabase" className="w-full">Supabase</TabsTrigger>
        </TabsList>

        <TabsContent value="api">
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
        </TabsContent>

        <TabsContent value="supabase">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Conectar ao Supabase
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supabaseUrl">URL do Projeto</Label>
                  <Input
                    id="supabaseUrl"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xxx.supabase.co"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supabaseKey">Chave Anon/Pública</Label>
                  <Input
                    id="supabaseKey"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    type="password"
                    placeholder="sua-chave-anon-publica"
                  />
                </div>

                <Button onClick={handleSupabaseConnect} className="w-full">
                  Conectar ao Supabase
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Como Conectar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Para conectar seu aplicativo ao Supabase, siga os passos:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Acesse o painel do Supabase</li>
                  <li>Crie um novo projeto ou selecione um existente</li>
                  <li>Na página de configurações do projeto, encontre as credenciais da API</li>
                  <li>Copie a URL do projeto e a chave anon/pública</li>
                  <li>Cole as credenciais nos campos ao lado</li>
                </ol>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                >
                  Acessar Painel do Supabase
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiConnectPage;
