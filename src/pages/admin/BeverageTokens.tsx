
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Beer, Receipt, Wine, QrCode, Barcode, Upload, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const BeverageTokensPage = () => {
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
                  <QrCode className="h-4 w-4" />
                  <span>Incluir QR Code</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Barcode className="h-4 w-4" />
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
      </div>
    </div>
  );
};

export default BeverageTokensPage;
