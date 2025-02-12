
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2 } from "lucide-react";

const ApiTokensPage = () => {
  const apiResponseExample = {
    token: {
      id: "tk_123456",
      securityCode: "ABC123",
      nsu: "123456",
      type: "FICHA DE CONSUMAÇÃO",
      value: 10.00,
      validFor: "Todas as bebidas",
      expirationDate: "31/12/2024",
      issuedAt: "15/03/2024 14:30:00",
      establishmentInfo: {
        name: "Nome do Estabelecimento",
        cnpj: "00.000.000/0000-00",
        address: "Endereço Completo",
        city: "Cidade - UF"
      },
      qrCodeData: {
        securityCode: "ABC123",
        nsu: "123456"
      },
      status: "active"
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          API de Fichas
        </h2>
        <p className="text-muted-foreground">
          Documentação para integração com a API de fichas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Documentação da API de Fichas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Base URL</h3>
              <code className="bg-muted p-2 rounded-md block">
                https://api.isapass.com/v1
              </code>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Endpoints</h3>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>GET</Badge>
                    <code>/tokens/:id</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Retorna os dados de uma ficha específica
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Parâmetros:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>id: ID da ficha (obrigatório)</li>
                    </ul>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>POST</Badge>
                    <code>/tokens/validate</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Valida uma ficha através do QR Code ou código de barras
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Body:</p>
                    <pre className="bg-muted p-2 rounded-md text-sm">
                      {`{
  "securityCode": "string",
  "nsu": "string"
}`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Exemplo de Resposta</h3>
                <div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    {JSON.stringify(apiResponseExample, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">SDKs para Fichas</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Android SDK</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-2 rounded-md text-sm">
                        implementation &apos;com.isapass:tokens-sdk:1.0.0&apos;
                      </pre>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">iOS SDK</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-2 rounded-md text-sm">
                        pod &apos;IsaPassTokens&apos;, &apos;~&gt; 1.0.0&apos;
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTokensPage;
