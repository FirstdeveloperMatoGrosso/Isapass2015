
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Printer, Receipt, FileText, Upload, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DigitalTicket } from "@/components/DigitalTicket";

export const PrintCustomization = () => {
  const handleSave = () => {
    toast.success("Configurações de impressão salvas com sucesso!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aqui você pode implementar o upload do arquivo
      toast.success("Logo enviada com sucesso!");
    }
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
          <div className="space-y-6 border-b pb-6">
            <h3 className="font-medium mb-4">Dados da Empresa</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo da Empresa</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG ou GIF. Máximo 2MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input placeholder="Digite o nome da sua empresa" />
                </div>

                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input placeholder="00.000.000/0000-00" />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input placeholder="Rua, número, bairro" />
              </div>

              <div className="space-y-2">
                <Label>Cidade/Estado</Label>
                <Input placeholder="Cidade - UF" />
              </div>

              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input placeholder="(00) 0000-0000" />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="contato@empresa.com" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cabeçalho Personalizado</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar cabeçalho com logo e informações da empresa
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
