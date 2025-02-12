
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2 } from "lucide-react";

const ApiTicketsPage = () => {
  const ticketApiExample = {
    ticket: {
      id: "TICKET_123456",
      securityCode: "SEC789",
      eventId: "EVENT_123",
      eventTitle: "Show do Metallica",
      eventDate: "2024-05-15",
      eventTime: "20:00",
      location: "Allianz Parque",
      area: "Pista Premium",
      price: 450.00,
      buyerInfo: {
        name: "João Silva",
        cpf: "123.456.789-00",
        email: "joao@email.com",
        phone: "(11) 98765-4321"
      },
      status: "valid",
      purchaseDate: "2024-03-15T14:30:00Z",
      qrCodeData: {
        ticketId: "TICKET_123456",
        securityCode: "SEC789",
        eventId: "EVENT_123"
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          API de Ingressos
        </h2>
        <p className="text-muted-foreground">
          Documentação para integração com a API de ingressos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Documentação da API de Ingressos
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
                    <code>/tickets/:id</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Retorna os dados de um ingresso específico
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Parâmetros:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>id: ID do ingresso (obrigatório)</li>
                    </ul>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>POST</Badge>
                    <code>/tickets/validate</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Valida um ingresso através do QR Code ou código de barras
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Body:</p>
                    <pre className="bg-muted p-2 rounded-md text-sm">
                      {`{
  "ticketId": "string",
  "securityCode": "string"
}`}
                    </pre>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>GET</Badge>
                    <code>/tickets/:id/print</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Retorna o HTML formatado para impressão do ingresso
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Query Parameters:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      <li>format: "html" | "pdf" (opcional, default: "html")</li>
                      <li>size: "a4" | "thermal" (opcional, default: "a4")</li>
                    </ul>
                  </div>
                </div>

                <div className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>POST</Badge>
                    <code>/tickets</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Cria um novo ingresso
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Body:</p>
                    <pre className="bg-muted p-2 rounded-md text-sm">
                      {`{
  "eventId": "string",
  "area": "string",
  "buyerInfo": {
    "name": "string",
    "cpf": "string",
    "email": "string",
    "phone": "string"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Exemplo de Resposta</h3>
                <div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    {JSON.stringify(ticketApiExample, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">SDKs para Ingressos</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Android SDK</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-2 rounded-md text-sm">
                        implementation &apos;com.isapass:tickets-sdk:1.0.0&apos;
                      </pre>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">iOS SDK</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-muted p-2 rounded-md text-sm">
                        pod &apos;IsaPassTickets&apos;, &apos;~&gt; 1.0.0&apos;
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Autenticação</h3>
                <p className="text-sm text-muted-foreground">
                  Todas as requisições devem incluir o header de autenticação:
                </p>
                <pre className="bg-muted p-2 rounded-md text-sm">
                  Authorization: Bearer seu-token-de-api
                </pre>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Códigos de Status</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><span className="font-medium">200</span> - Sucesso</li>
                  <li><span className="font-medium">201</span> - Criado com sucesso</li>
                  <li><span className="font-medium">400</span> - Requisição inválida</li>
                  <li><span className="font-medium">401</span> - Não autorizado</li>
                  <li><span className="font-medium">404</span> - Não encontrado</li>
                  <li><span className="font-medium">500</span> - Erro interno do servidor</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTicketsPage;
