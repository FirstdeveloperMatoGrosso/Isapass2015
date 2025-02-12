
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Printer, Receipt, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DigitalTicket } from "@/components/DigitalTicket";

export const PrintCustomization = () => {
  const handleSave = () => {
    toast.success("Configurações de impressão salvas com sucesso!");
  };

  const previewTicket = {
    ticketId: "TK123456",
    securityCode: "SEC789",
    purchaseDate: "01/03/2024",
    eventTitle: "Exemplo de Evento",
    eventDate: "15/03/2024",
    eventTime: "20:00",
    location: "Local do Evento",
    area: "Área VIP",
    buyerName: "João Silva",
    buyerCpf: "123.456.789-00",
    buyerPhone: "(11) 98765-4321"
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Personalização de Impressão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cabeçalho Personalizado</Label>
                <p className="text-sm text-muted-foreground">
                  Adicione seu logotipo e informações da empresa
                </p>
              </div>
              <Switch />
            </div>

            <div className="space-y-2">
              <Label>Formato do Papel</Label>
              <Select defaultValue="a4">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="a5">A5</SelectItem>
                  <SelectItem value="thermal">Térmica 80mm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Orientação</Label>
              <Select defaultValue="portrait">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a orientação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Retrato</SelectItem>
                  <SelectItem value="landscape">Paisagem</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Elementos do Comprovante</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  <span>QR Code</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  <span>Código de Barras</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  <span>Informações do Cliente</span>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Elementos do Relatório</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Gráficos</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Tabelas</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Totalizadores</span>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            Salvar Configurações
          </Button>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Prévia do Modelo de Impressão</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Clique no modelo abaixo para visualizar em tamanho maior
            </p>
            <DigitalTicket {...previewTicket} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
