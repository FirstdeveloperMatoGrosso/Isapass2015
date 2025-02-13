
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShareOptions } from "@/components/ShareOptions";
import { CreditCard, QrCode, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

interface PaymentConfig {
  stone: {
    clientId: string;
    clientSecret: string;
    acceptCredit: boolean;
    acceptBoleto: boolean;
    acceptPix: boolean;
  };
  mercadopago: {
    accessToken: string;
    publicKey: string;
    acceptCredit: boolean;
    acceptBoleto: boolean;
    acceptPix: boolean;
  };
  pagarme: {
    apiKey: string;
    publicKey: string;
    acceptCredit: boolean;
    acceptBoleto: boolean;
    acceptPix: boolean;
  };
}

const SettingsPage = () => {
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    stone: {
      clientId: '',
      clientSecret: '',
      acceptCredit: false,
      acceptBoleto: false,
      acceptPix: false
    },
    mercadopago: {
      accessToken: '',
      publicKey: '',
      acceptCredit: false,
      acceptBoleto: false,
      acceptPix: false
    },
    pagarme: {
      apiKey: '',
      publicKey: '',
      acceptCredit: false,
      acceptBoleto: false,
      acceptPix: false
    }
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('paymentConfig');
    if (savedConfig) {
      setPaymentConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSavePaymentSettings = () => {
    localStorage.setItem('paymentConfig', JSON.stringify(paymentConfig));
    toast.success("Configurações de pagamento salvas com sucesso!");
  };

  const handleChangePaymentConfig = (
    gateway: keyof PaymentConfig,
    field: string,
    value: string | boolean
  ) => {
    setPaymentConfig(prev => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        [field]: value
      }
    }));
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShareOptions />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Impressão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Formato do Ingresso</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input type="radio" id="a4" name="format" value="a4" />
                <Label htmlFor="a4">A4</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="thermal" name="format" value="thermal" />
                <Label htmlFor="thermal">Térmica</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Impressora Padrão</Label>
            <Input placeholder="Selecione a impressora" />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="auto-print" />
            <Label htmlFor="auto-print">Impressão automática</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gateways de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="stone" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="stone">Stone</TabsTrigger>
              <TabsTrigger value="mercadopago">Mercado Pago</TabsTrigger>
              <TabsTrigger value="pagarme">Pagar.me</TabsTrigger>
            </TabsList>

            <TabsContent value="stone" className="space-y-4">
              <div className="space-y-2">
                <Label>Stone Client ID</Label>
                <Input 
                  type="password" 
                  placeholder="•••••••••••••••••"
                  value={paymentConfig.stone.clientId}
                  onChange={(e) => handleChangePaymentConfig('stone', 'clientId', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Stone Client Secret</Label>
                <Input 
                  type="password" 
                  placeholder="•••••••••••••••••"
                  value={paymentConfig.stone.clientSecret}
                  onChange={(e) => handleChangePaymentConfig('stone', 'clientSecret', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <Label>Aceitar Cartão de Crédito</Label>
                <Switch 
                  checked={paymentConfig.stone.acceptCredit}
                  onCheckedChange={(checked) => handleChangePaymentConfig('stone', 'acceptCredit', checked)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                <Label>Aceitar Boleto</Label>
                <Switch 
                  checked={paymentConfig.stone.acceptBoleto}
                  onCheckedChange={(checked) => handleChangePaymentConfig('stone', 'acceptBoleto', checked)}
                />
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                <Label>Aceitar PIX</Label>
                <Switch 
                  checked={paymentConfig.stone.acceptPix}
                  onCheckedChange={(checked) => handleChangePaymentConfig('stone', 'acceptPix', checked)}
                />
              </div>
            </TabsContent>

            <TabsContent value="mercadopago" className="space-y-4">
              <div className="space-y-2">
                <Label>Access Token</Label>
                <Input 
                  type="password" 
                  placeholder="TEST-0000000000000000-000000-000000000000000000000000"
                  value={paymentConfig.mercadopago.accessToken}
                  onChange={(e) => handleChangePaymentConfig('mercadopago', 'accessToken', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Public Key</Label>
                <Input 
                  type="password" 
                  placeholder="TEST-0000000-0000000000000"
                  value={paymentConfig.mercadopago.publicKey}
                  onChange={(e) => handleChangePaymentConfig('mercadopago', 'publicKey', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <Label>Aceitar Cartão de Crédito</Label>
                <Switch 
                  checked={paymentConfig.mercadopago.acceptCredit}
                  onCheckedChange={(checked) => handleChangePaymentConfig('mercadopago', 'acceptCredit', checked)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                <Label>Aceitar Boleto</Label>
                <Switch 
                  checked={paymentConfig.mercadopago.acceptBoleto}
                  onCheckedChange={(checked) => handleChangePaymentConfig('mercadopago', 'acceptBoleto', checked)}
                />
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                <Label>Aceitar PIX</Label>
                <Switch 
                  checked={paymentConfig.mercadopago.acceptPix}
                  onCheckedChange={(checked) => handleChangePaymentConfig('mercadopago', 'acceptPix', checked)}
                />
              </div>
            </TabsContent>

            <TabsContent value="pagarme" className="space-y-4">
              <div className="space-y-1">
                <Label>Chave da API</Label>
                <Input 
                  type="password" 
                  placeholder="sk_test_..." 
                  value={paymentConfig.pagarme.apiKey}
                  onChange={(e) => handleChangePaymentConfig('pagarme', 'apiKey', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Chave secreta utilizada para integração com a API do Pagar.me
                </p>
              </div>
              <div className="space-y-1">
                <Label>Chave Pública</Label>
                <Input 
                  type="text" 
                  placeholder="pk_test_..." 
                  value={paymentConfig.pagarme.publicKey}
                  onChange={(e) => handleChangePaymentConfig('pagarme', 'publicKey', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Chave pública utilizada para testes na API
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <Label>Aceitar Cartão de Crédito</Label>
                <Switch 
                  checked={paymentConfig.pagarme.acceptCredit}
                  onCheckedChange={(checked) => handleChangePaymentConfig('pagarme', 'acceptCredit', checked)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                <Label>Aceitar Boleto</Label>
                <Switch 
                  checked={paymentConfig.pagarme.acceptBoleto}
                  onCheckedChange={(checked) => handleChangePaymentConfig('pagarme', 'acceptBoleto', checked)}
                />
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                <Label>Aceitar PIX</Label>
                <Switch 
                  checked={paymentConfig.pagarme.acceptPix}
                  onCheckedChange={(checked) => handleChangePaymentConfig('pagarme', 'acceptPix', checked)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button className="w-full" onClick={handleSavePaymentSettings}>
            Salvar Configurações de Pagamento
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo da Empresa</Label>
            <Input type="file" accept="image/*" />
          </div>

          <div className="space-y-2">
            <Label>Cores Principais</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input type="color" />
              <Input type="color" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="email-notifications" />
            <Label htmlFor="email-notifications">Notificações por Email</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="sms-notifications" />
            <Label htmlFor="sms-notifications">Notificações por SMS</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="whatsapp-notifications" />
            <Label htmlFor="whatsapp-notifications">Notificações por WhatsApp</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
