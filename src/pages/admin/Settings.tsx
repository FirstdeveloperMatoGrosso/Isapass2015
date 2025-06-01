
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { QRCodeSVG } from "qrcode.react";
import { createStaticPix, hasError } from "pix-utils";
import Barcode from "react-barcode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShareOptions } from "@/components/ShareOptions";
import { CreditCard, QrCode, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

interface PrinterConfig {
  format: 'a4' | 'thermal80' | 'thermal58';
  model: string;
  logoPosition: 'top' | 'bottom';
  logoSize: number;
  showQRCode: boolean;
  showBarcode: boolean;
  logoUrl: string;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

interface PaymentConfig {
  stone: {
    enabled: boolean;
    stoneCode: string;
    clientId: string;
    clientSecret: string;
    acceptCredit: boolean;
    acceptBoleto: boolean;
    acceptPix: boolean;
  };
  cielo: {
    enabled: boolean;
    merchantId: string;
    merchantKey: string;
  };
  mercadopago: {
    enabled: boolean;
    accessToken: string;
    publicKey: string;
    acceptCredit: boolean;
    acceptBoleto: boolean;
    acceptPix: boolean;
  };
  pix: {
    enabled: boolean;
    key: string;
    merchantName: string;
    merchantCity: string;
    partnerId: string;
    expirationMinutes: number;
  };
  pagarme: {
    enabled: boolean;
    apiKey: string;
    publicKey: string;
    acceptCredit: boolean;
    acceptBoleto: boolean;
    acceptPix: boolean;
  };
}

const printerModels = [
  { id: 'epson_tm20', name: 'Epson TM-20', type: 'thermal80' },
  { id: 'epson_tm88', name: 'Epson TM-88', type: 'thermal80' },
  { id: 'bematech_mp4200', name: 'Bematech MP-4200 TH', type: 'thermal80' },
  { id: 'elgin_i9', name: 'Elgin I9', type: 'thermal80' },
  { id: 'daruma_dr800', name: 'Daruma DR800', type: 'thermal80' },
  { id: 'custom_58', name: 'Custom 58mm', type: 'thermal58' },
  { id: 'generic_58', name: 'Impressora Térmica 58mm', type: 'thermal58' },
  { id: 'generic_80', name: 'Impressora Térmica 80mm', type: 'thermal80' },
  { id: 'generic_a4', name: 'Impressora A4', type: 'a4' },
];

const SettingsPage = () => {
  const [printerConfig, setPrinterConfig] = useState<PrinterConfig>({
    format: 'thermal80',
    model: 'generic80',
    logoPosition: 'top',
    logoSize: 100,
    showQRCode: true,
    showBarcode: true,
    logoUrl: '',
    margins: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });

  const generatePixQrCode = (value: number = 100) => {
    if (!paymentConfig.pix.enabled || !paymentConfig.pix.key) return '';

    const pix = createStaticPix({
      merchantName: paymentConfig.pix.merchantName,
      merchantCity: paymentConfig.pix.merchantCity,
      pixKey: paymentConfig.pix.key,
      infoAdicional: 'Pagamento do Ingresso',
      txid: `${paymentConfig.pix.partnerId || 'ISA'}${Date.now()}`.substring(0, 25),
      transactionAmount: value,
    });

    if (!hasError(pix)) {
      return pix.toBRCode();
    }
    
    return '';
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrinterConfig(prev => ({
          ...prev,
          logoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    stone: {
      enabled: false,
      stoneCode: '',
      clientId: '',
      clientSecret: '',
      acceptCredit: false,
      acceptBoleto: false,
      acceptPix: false
    },
    cielo: {
      enabled: false,
      merchantId: '',
      merchantKey: ''
    },
    mercadopago: {
      enabled: false,
      accessToken: '',
      publicKey: '',
      acceptCredit: false,
      acceptBoleto: false,
      acceptPix: false
    },
    pix: {
      enabled: false,
      key: '',
      merchantName: '',
      merchantCity: '',
      partnerId: '',
      expirationMinutes: 30
    },
    pagarme: {
      enabled: false,
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

    const savedPrinterConfig = localStorage.getItem('printerConfig');
    if (savedPrinterConfig) {
      setPrinterConfig(JSON.parse(savedPrinterConfig));
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
    <div className="p-8 bg-gradient-to-b from-background to-background/80 min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Configurações</h2>
            <p className="text-muted-foreground">
              Gerencie as configurações do sistema
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShareOptions />
          </div>
        </div>
        
        <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60 rounded-xl overflow-hidden">
        <CardHeader className="p-6">
          <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Configurações de Impressão</CardTitle>
          <CardDescription>Configure o layout e as opções de impressão dos ingressos</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Logo do Evento</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="flex-1"
                    />
                    {printerConfig.logoUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPrinterConfig(prev => ({ ...prev, logoUrl: '' }))}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                  {printerConfig.logoUrl && (
                    <div className="w-40 h-20 relative border rounded-lg overflow-hidden">
                      <img 
                        src={printerConfig.logoUrl} 
                        alt="Logo do evento" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <Label className="text-base font-medium">Modelo de Impressora</Label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-input bg-background/50"
                  value={printerConfig.model}
                  onChange={(e) => {
                    const model = printerModels.find(m => m.id === e.target.value);
                    setPrinterConfig(prev => ({
                      ...prev,
                      printer: e.target.value,
                      format: (model?.type || prev.format) as PrinterConfig['format']
                    }));
                  }}
                >
                  <option value="">Selecione uma impressora</option>
                  {printerModels.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Posição da Logo</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="logo-top" 
                      name="logoPosition" 
                      value="top"
                      checked={printerConfig.logoPosition === 'top'}
                      onChange={(e) => setPrinterConfig(prev => ({ ...prev, logoPosition: 'top' }))}
                    />
                    <Label htmlFor="logo-top">Topo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="logo-bottom" 
                      name="logoPosition" 
                      value="bottom"
                      checked={printerConfig.logoPosition === 'bottom'}
                      onChange={(e) => setPrinterConfig(prev => ({ ...prev, logoPosition: 'bottom' }))}
                    />
                    <Label htmlFor="logo-bottom">Base</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Tamanho da Logo</Label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="50" 
                    max="150" 
                    value={printerConfig.logoSize}
                    onChange={(e) => setPrinterConfig(prev => ({ ...prev, logoSize: Number(e.target.value) }))}
                    className="w-full"
                  />
                  <span className="text-sm">{printerConfig.logoSize}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Elementos do Ingresso</Label>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">PIX</Label>
                      <Switch
                        checked={paymentConfig.pix.enabled}
                        onCheckedChange={(checked) => setPaymentConfig(prev => ({
                          ...prev,
                          pix: { ...prev.pix, enabled: checked }
                        }))}
                      />
                    </div>

                    {paymentConfig.pix.enabled && (
                      <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                        <div className="space-y-2">
                          <Label>Chave PIX</Label>
                          <Input
                            placeholder="Chave PIX (CPF, CNPJ, email, telefone ou chave aleatória)"
                            value={paymentConfig.pix.key}
                            onChange={(e) => setPaymentConfig(prev => ({
                              ...prev,
                              pix: { ...prev.pix, key: e.target.value }
                            }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Nome do Beneficiário</Label>
                          <Input
                            placeholder="Nome da empresa ou pessoa física"
                            value={paymentConfig.pix.merchantName}
                            onChange={(e) => setPaymentConfig(prev => ({
                              ...prev,
                              pix: { ...prev.pix, merchantName: e.target.value }
                            }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Cidade do Beneficiário</Label>
                          <Input
                            placeholder="Cidade onde está localizado"
                            value={paymentConfig.pix.merchantCity}
                            onChange={(e) => setPaymentConfig(prev => ({
                              ...prev,
                              pix: { ...prev.pix, merchantCity: e.target.value }
                            }))}
                          />
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <Label>Informações incluídas no PIX</Label>
                          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                            <li>Valor do ingresso</li>
                            <li>ID único da transação (ID Parceria + timestamp)</li>
                            <li>Nome e cidade do beneficiário</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Stone</Label>
                    <Switch 
                      id="show-qr"
                      checked={printerConfig.showQRCode}
                      onCheckedChange={(checked) => setPrinterConfig(prev => ({ ...prev, showQRCode: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-barcode">Mostrar Código de Barras</Label>
                    <Switch 
                      id="show-barcode"
                      checked={printerConfig.showBarcode}
                      onCheckedChange={(checked) => setPrinterConfig(prev => ({ ...prev, showBarcode: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Margens (mm)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Superior</Label>
                    <Input 
                      type="number" 
                      min="0" 
                      value={printerConfig.margins.top}
                      onChange={(e) => setPrinterConfig(prev => ({ 
                        ...prev, 
                        margins: { ...prev.margins, top: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Direita</Label>
                    <Input 
                      type="number" 
                      min="0"
                      value={printerConfig.margins.right}
                      onChange={(e) => setPrinterConfig(prev => ({ 
                        ...prev, 
                        margins: { ...prev.margins, right: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Inferior</Label>
                    <Input 
                      type="number" 
                      min="0"
                      value={printerConfig.margins.bottom}
                      onChange={(e) => setPrinterConfig(prev => ({ 
                        ...prev, 
                        margins: { ...prev.margins, bottom: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Esquerda</Label>
                    <Input 
                      type="number" 
                      min="0"
                      value={printerConfig.margins.left}
                      onChange={(e) => setPrinterConfig(prev => ({ 
                        ...prev, 
                        margins: { ...prev.margins, left: Number(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Preview do Ingresso</Label>
              <div className="bg-white rounded-lg overflow-hidden border w-[280px] mx-auto">
                <div className="p-4 flex flex-col min-h-[500px]">
                  {printerConfig.logoPosition === 'top' && (
                    <div 
                      className="w-full h-16 flex items-center justify-center mb-4 overflow-hidden"
                      style={{ transform: `scale(${printerConfig.logoSize / 100})` }}
                    >
                      {printerConfig.logoUrl ? (
                        <img 
                          src={printerConfig.logoUrl} 
                          alt="Logo do evento" 
                          className="h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-sm">
                          Logo do Evento
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold">Show do Metallica</h3>
                    <p className="text-sm text-gray-600">Ingresso Digital</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Data:</span>
                      <span>15/05/2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Hora:</span>
                      <span>20:00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Local:</span>
                      <span>Allianz Parque - São Paulo, SP</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Área:</span>
                      <span>Pista Premium</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div>
                      <span className="font-medium">Nome:</span>
                      <span className="ml-1">rodrigodev@yahoo.com</span>
                    </div>
                    <div>
                      <span className="font-medium">CPF:</span>
                      <span className="ml-1">Não informado</span>
                    </div>
                    <div>
                      <span className="font-medium">Tel:</span>
                      <span className="ml-1">Não informado</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4 text-sm">
                    <div>
                      <span className="font-medium">ID:</span>
                      <span className="ml-1">TK123456</span>
                    </div>
                    <div>
                      <span className="font-medium">Código:</span>
                      <span className="ml-1">ABC123</span>
                    </div>
                    <div>
                      <span className="font-medium">Compra:</span>
                      <span className="ml-1">20/02/2024 14:30</span>
                    </div>
                  </div>

                  {printerConfig.showQRCode && (
                    <div className="w-full aspect-square bg-white border flex items-center justify-center mb-2">
                      <QRCodeSVG 
                        value={generatePixQrCode()}
                        size={192}
                        level="H"
                        includeMargin={false}
                        className="w-48 h-48"
                      />
                    </div>
                  )}

                  {printerConfig.showBarcode && (
                    <div className="w-full flex flex-col items-center">
                      <Barcode 
                        value="TK123456"
                        width={1.5}
                        height={40}
                        fontSize={0}
                        margin={0}
                        displayValue={false}
                      />
                      <p className="text-xs text-center text-gray-500">Código de Barras</p>
                    </div>
                  )}

                  <p className="text-[10px] text-center text-gray-500 mt-2">
                    Este ingresso é pessoal e intransferível. Apresente este QR Code na entrada do evento.
                  </p>
                  {printerConfig.logoPosition === 'bottom' && (
                    <div 
                      className="w-full h-16 flex items-center justify-center mt-4 overflow-hidden"
                      style={{ transform: `scale(${printerConfig.logoSize / 100})` }}
                    >
                      {printerConfig.logoUrl ? (
                        <img 
                          src={printerConfig.logoUrl} 
                          alt="Logo do evento" 
                          className="h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-sm">
                          Logo do Evento
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground/80 text-center mt-4 px-4">
                Este é um exemplo de como o ingresso será impresso.
                As dimensões e posições podem variar de acordo com o modelo de impressora selecionado.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button 
              onClick={() => {
                localStorage.setItem('printerConfig', JSON.stringify(printerConfig));
                toast.success("Configurações de impressão salvas com sucesso!");
              }}
              className="bg-primary/90 hover:bg-primary transition-colors"
            >
              Salvar Configurações de Impressão
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="auto-print" />
            <Label htmlFor="auto-print">Impressão automática</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60 rounded-xl overflow-hidden">
        <CardHeader className="p-6">
          <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Preferências Gerais</CardTitle>
          <CardDescription className="text-muted-foreground">Configure suas preferências gerais do sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="inline-flex p-1 bg-muted/50 backdrop-blur rounded-lg">
              <TabsTrigger value="general" className="rounded-md px-6">Geral</TabsTrigger>
              <TabsTrigger value="appearance" className="rounded-md px-6">Aparência</TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-md px-6">Notificações</TabsTrigger>
              <TabsTrigger value="security" className="rounded-md px-6">Segurança</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label>Logo da Empresa</Label>
                <Input type="file" accept="image/*" />
              </div>

              <div className="space-y-2">
                <Label>Cores Principais</Label>
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  <Input type="color" />
                  <Input type="color" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
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

      <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60 rounded-xl overflow-hidden">
        <CardHeader className="p-6">
          <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Personalização</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-2">
            <Label>Logo da Empresa</Label>
            <Input type="file" accept="image/*" />
          </div>

          <div className="space-y-2">
            <Label>Cores Principais</Label>
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Input type="color" />
              <Input type="color" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60 rounded-xl overflow-hidden">
        <CardHeader className="p-6">
          <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Notificações</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
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
