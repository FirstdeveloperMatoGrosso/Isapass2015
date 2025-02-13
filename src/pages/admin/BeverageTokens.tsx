import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Beer, Receipt, Wine, QrCode as QrCodeIcon, BarcodeIcon, Upload, Building2, Coffee, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import BarcodeGenerator from "react-barcode";
import { useState } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
}

const BeverageTokensPage = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Cerveja Pilsen",
      price: 8,
      category: "beer",
      description: "Cerveja tipo Pilsen 350ml"
    },
    {
      id: "2",
      name: "Refrigerante",
      price: 5,
      category: "soft",
      description: "Refrigerante 350ml"
    }
  ]);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    category: "beer",
    description: ""
  });

  const [securityCode] = useState(() => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  });

  const [nsu] = useState(() => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  });

  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd/MM/yyyy");
  const formattedTime = format(currentDate, "HH:mm:ss");

  const handleSave = () => {
    toast.success("Configurações de fichas salvas com sucesso!");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success("Logo enviada com sucesso!");
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Por favor, preencha nome e preço do produto");
      return;
    }

    const product: Product = {
      id: Math.random().toString(36).substring(7),
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category || "beer",
      description: newProduct.description
    };

    setProducts([...products, product]);
    setNewProduct({ name: "", price: 0, category: "beer", description: "" });
    toast.success("Produto adicionado com sucesso!");
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Produto removido com sucesso!");
  };

  const qrCodeData = {
    securityCode,
    nsu,
    type: "FICHA DE CONSUMAÇÃO",
    value: "R$ 10,00",
    validFor: "Todas as bebidas",
    expirationDate: "31/12/2024",
    issuedAt: `${formattedDate} ${formattedTime}`
  };

  const apiResponseExample = {
    token: {
      id: "tk_123456",
      securityCode: securityCode,
      nsu,
      type: "FICHA DE CONSUMAÇÃO",
      value: 10.00,
      validFor: "Todas as bebidas",
      expirationDate: "31/12/2024",
      issuedAt: `${formattedDate} ${formattedTime}`,
      establishmentInfo: {
        name: "Nome do Estabelecimento",
        cnpj: "00.000.000/0000-00",
        address: "Endereço Completo",
        city: "Cidade - UF"
      },
      qrCodeData: qrCodeData,
      status: "active"
    }
  };

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
          Fichas de Bebidas
        </h2>
        <p className="text-muted-foreground">
          Configure os tipos de fichas para o bar
        </p>
      </div>

      <Tabs defaultValue="tokens" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tokens">Configuração de Fichas</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                Produtos para Consumo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome do Produto</Label>
                    <Input
                      placeholder="Ex: Cerveja Pilsen 350ml"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preço</Label>
                    <Input
                      type="number"
                      placeholder="R$ 0,00"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beer">Cerveja</SelectItem>
                        <SelectItem value="wine">Vinho</SelectItem>
                        <SelectItem value="spirits">Destilados</SelectItem>
                        <SelectItem value="soft">Não Alcoólicos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      placeholder="Descrição do produto"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleAddProduct} className="w-full">
                    Adicionar Produto
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Produtos Cadastrados</h3>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.description} - R$ {product.price.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens">
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
              {/* Nova prévia no formato 54mm */}
              <div className="w-[204px] mx-auto border rounded-none bg-white p-2 text-[10px] leading-tight space-y-2">
                <div className="text-center border-b pb-2">
                  <div className="w-12 h-12 mx-auto bg-muted rounded-lg flex items-center justify-center mb-1">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="font-bold text-[12px]">Nome do Evento/Empresa</p>
                  <p>CNPJ: 00.000.000/0000-00</p>
                  <p className="text-[9px]">Endereço Completo, Cidade - UF</p>
                </div>

                <div className="text-center space-y-1 py-1">
                  <p className="font-bold text-[12px]">FICHA DE CONSUMAÇÃO</p>
                  <p className="font-bold text-[14px]">R$ 10,00</p>
                  <p>Válida para todas as bebidas</p>
                </div>

                <div className="text-center space-y-0.5 text-[9px]">
                  <p>NSU: {nsu}</p>
                  <p>Data: {formattedDate}</p>
                  <p>Hora: {formattedTime}</p>
                </div>

                <div className="flex flex-col items-center gap-2 pt-2 border-t">
                  <div>
                    <QRCodeSVG 
                      value={JSON.stringify(qrCodeData)}
                      size={120}
                      level="H"
                      includeMargin={false}
                    />
                    <p className="text-center text-[9px] mt-1">QR Code</p>
                  </div>
                  <div>
                    <BarcodeGenerator 
                      value={securityCode}
                      height={40}
                      width={1}
                      fontSize={8}
                      margin={0}
                      textMargin={2}
                    />
                    <p className="text-center text-[9px] mt-1">Código: {securityCode}</p>
                  </div>
                </div>

                <div className="text-center border-t pt-2 mt-2">
                  <p className="text-[8px]">Venda e consumo proibidos para menores de 18 anos</p>
                  <p className="text-[8px]">Válido até: 31/12/2024</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground text-center">
                Esta é uma prévia da ficha no formato 54mm para impressora térmica.
                As informações serão atualizadas conforme você fizer alterações nas configurações acima.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BeverageTokensPage;
