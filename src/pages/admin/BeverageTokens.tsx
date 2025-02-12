
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Beer, Receipt, Wine, QrCode as QrCodeIcon, BarcodeIcon, Upload, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import QRCodeReact from "qrcode.react";
import BarcodeGenerator from "react-barcode";
import { useState } from "react";

const BeverageTokensPage = () => {
  const [securityCode] = useState(() => {
    // Gera um código de segurança aleatório de 8 dígitos
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  });

  const handleSave = () => {
    toast.success("Configurações de fichas salvas com sucesso!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aqui você pode implementar o upload do arquivo
      toast.success("Logo enviada com sucesso!");
    }
  };

  // Dados que serão codificados no QR Code
  const qrCodeData = {
    securityCode,
    type: "FICHA DE CONSUMAÇÃO",
    value: "R$ 10,00",
    validFor: "Todas as bebidas",
    expirationDate: "31/12/2024"
  };

  return (
    <div className="p-4">
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Fichas de Bebidas
        </h2>
        <p className="text-muted-foreground">
          Configure os tipos de fichas para o bar
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Personalização do Título
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo do Evento/Empresa</Label>
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
                  <Label>Nome do Evento/Empresa</Label>
                  <Input placeholder="Digite o nome do evento ou empresa" />
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beer className="h-5 w-5" />
              Configuração de Fichas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Título da Ficha</Label>
                  <Input placeholder="Ex: Ficha de Consumação" />
                </div>

                <div className="space-y-2">
                  <Label>Valor da Ficha</Label>
                  <Input type="number" placeholder="R$ 0,00" />
                </div>

                <div className="space-y-2">
                  <Label>Cor da Ficha</Label>
                  <Select defaultValue="blue">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Azul</SelectItem>
                      <SelectItem value="red">Vermelho</SelectItem>
                      <SelectItem value="green">Verde</SelectItem>
                      <SelectItem value="yellow">Amarelo</SelectItem>
                      <SelectItem value="purple">Roxo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Bebida</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Bebidas</SelectItem>
                      <SelectItem value="beer">Cerveja</SelectItem>
                      <SelectItem value="wine">Vinho</SelectItem>
                      <SelectItem value="spirits">Destilados</SelectItem>
                      <SelectItem value="soft">Não Alcoólicos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Numeração</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" placeholder="Início" />
                    <Input type="number" placeholder="Fim" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Validade</Label>
                  <Input type="date" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCodeIcon className="h-4 w-4" />
                  <span>Incluir QR Code</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarcodeIcon className="h-4 w-4" />
                  <span>Incluir Código de Barras</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wine className="h-4 w-4" />
                  <span>Aviso de Consumo para Menores</span>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Adicionar Novo Tipo de Ficha
            </Button>

            <div className="border-t pt-6">
              <Button onClick={handleSave} className="w-full">
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Prévia da Ficha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-white">
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b pb-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold">Nome do Evento/Empresa</h3>
                    <p className="text-sm text-muted-foreground">CNPJ: 00.000.000/0000-00</p>
                    <p className="text-sm text-muted-foreground">Endereço Completo, Cidade - UF</p>
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <h4 className="font-bold text-xl">FICHA DE CONSUMAÇÃO</h4>
                  <div className="text-2xl font-bold text-primary">R$ 10,00</div>
                  <p className="text-sm">Válida para todas as bebidas</p>
                </div>

                <div className="flex justify-center gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mb-2">
                      <QRCodeReact
                        value={JSON.stringify(qrCodeData)}
                        size={80}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">QR Code</span>
                  </div>
                  <div className="text-center">
                    <div className="w-auto h-20 bg-white rounded-lg flex items-center justify-center mb-2 px-2">
                      <BarcodeGenerator 
                        value={securityCode}
                        height={60}
                        width={1.5}
                        fontSize={12}
                        margin={0}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">Código de Segurança: {securityCode}</span>
                  </div>
                </div>

                <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                  <p>Venda e consumo proibidos para menores de 18 anos</p>
                  <p>Válido até: 31/12/2024</p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground text-center">
              Esta é uma prévia de como sua ficha ficará após a impressão.
              As informações serão atualizadas conforme você fizer alterações nas configurações acima.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BeverageTokensPage;
