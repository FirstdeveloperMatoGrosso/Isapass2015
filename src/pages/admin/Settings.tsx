
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShareOptions } from "@/components/ShareOptions";
import { CreditCard, QrCode, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

interface PaymentSettings {
  id?: string;
  gateway: string;
  client_id?: string;
  client_secret?: string;
  access_token?: string;
  public_key?: string;
  api_key?: string;
  encryption_key?: string;
  accept_credit_card: boolean;
  accept_boleto: boolean;
  accept_pix: boolean;
}

const SettingsPage = () => {
  const [activeGateway, setActiveGateway] = useState("stone");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Record<string, PaymentSettings>>({
    stone: {
      gateway: "stone",
      accept_credit_card: true,
      accept_boleto: true,
      accept_pix: true
    },
    mercadopago: {
      gateway: "mercadopago",
      accept_credit_card: true,
      accept_boleto: true,
      accept_pix: true
    },
    pagarme: {
      gateway: "pagarme",
      accept_credit_card: true,
      accept_boleto: true,
      accept_pix: true
    }
  });

  useEffect(() => {
    loadPaymentSettings();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*');

      if (error) throw error;

      const newSettings = { ...settings };
      data?.forEach(setting => {
        newSettings[setting.gateway] = setting;
      });
      setSettings(newSettings);
    } catch (error) {
      console.error('Error loading payment settings:', error);
      toast.error("Erro ao carregar configurações de pagamento");
    }
  };

  const handleSavePaymentSettings = async () => {
    setLoading(true);
    try {
      const currentSettings = settings[activeGateway];
      
      const { data, error } = await supabase
        .from('payment_settings')
        .upsert({
          ...currentSettings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'gateway'
        });

      if (error) throw error;

      toast.success("Configurações de pagamento salvas com sucesso!");
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast.error("Erro ao salvar configurações de pagamento");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [activeGateway]: {
        ...prev[activeGateway],
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
      
      <div className="grid gap-4 md:grid-cols-2">
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
            <Tabs value={activeGateway} onValueChange={setActiveGateway} className="w-full">
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
                    value={settings.stone.client_id || ''} 
                    onChange={(e) => handleInputChange('client_id', e.target.value)}
                    placeholder="•••••••••••••••••" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stone Client Secret</Label>
                  <Input 
                    type="password" 
                    value={settings.stone.client_secret || ''} 
                    onChange={(e) => handleInputChange('client_secret', e.target.value)}
                    placeholder="•••••••••••••••••" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <Label>Aceitar Cartão de Crédito</Label>
                  <Switch 
                    checked={settings.stone.accept_credit_card}
                    onCheckedChange={(checked) => handleInputChange('accept_credit_card', checked)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  <Label>Aceitar Boleto</Label>
                  <Switch 
                    checked={settings.stone.accept_boleto}
                    onCheckedChange={(checked) => handleInputChange('accept_boleto', checked)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  <Label>Aceitar PIX</Label>
                  <Switch 
                    checked={settings.stone.accept_pix}
                    onCheckedChange={(checked) => handleInputChange('accept_pix', checked)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="mercadopago" className="space-y-4">
                <div className="space-y-2">
                  <Label>Access Token</Label>
                  <Input 
                    type="password" 
                    value={settings.mercadopago.access_token || ''} 
                    onChange={(e) => handleInputChange('access_token', e.target.value)}
                    placeholder="TEST-0000000000000000-000000-000000000000000000000000" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Public Key</Label>
                  <Input 
                    type="password" 
                    value={settings.mercadopago.public_key || ''} 
                    onChange={(e) => handleInputChange('public_key', e.target.value)}
                    placeholder="TEST-0000000-0000000000000" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <Label>Aceitar Cartão de Crédito</Label>
                  <Switch 
                    checked={settings.mercadopago.accept_credit_card}
                    onCheckedChange={(checked) => handleInputChange('accept_credit_card', checked)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  <Label>Aceitar Boleto</Label>
                  <Switch 
                    checked={settings.mercadopago.accept_boleto}
                    onCheckedChange={(checked) => handleInputChange('accept_boleto', checked)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  <Label>Aceitar PIX</Label>
                  <Switch 
                    checked={settings.mercadopago.accept_pix}
                    onCheckedChange={(checked) => handleInputChange('accept_pix', checked)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="pagarme" className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input 
                    type="password" 
                    value={settings.pagarme.api_key || ''} 
                    onChange={(e) => handleInputChange('api_key', e.target.value)}
                    placeholder="ak_test_00000000000000000000000000000000" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Encryption Key</Label>
                  <Input 
                    type="password" 
                    value={settings.pagarme.encryption_key || ''} 
                    onChange={(e) => handleInputChange('encryption_key', e.target.value)}
                    placeholder="ek_test_00000000000000000000000000000000" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <Label>Aceitar Cartão de Crédito</Label>
                  <Switch 
                    checked={settings.pagarme.accept_credit_card}
                    onCheckedChange={(checked) => handleInputChange('accept_credit_card', checked)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  <Label>Aceitar Boleto</Label>
                  <Switch 
                    checked={settings.pagarme.accept_boleto}
                    onCheckedChange={(checked) => handleInputChange('accept_boleto', checked)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  <Label>Aceitar PIX</Label>
                  <Switch 
                    checked={settings.pagarme.accept_pix}
                    onCheckedChange={(checked) => handleInputChange('accept_pix', checked)}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Button 
              className="w-full" 
              onClick={handleSavePaymentSettings}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Configurações de Pagamento"}
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
    </div>
  );
};

export default SettingsPage;
