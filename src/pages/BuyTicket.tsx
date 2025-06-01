import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { Calendar, MapPin, CreditCard, Scan, DollarSign, Copy, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DigitalTicket } from "@/components/DigitalTicket";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
// Importar o Dialog customizado sem o botão X
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/CustomDialog";
// Importar o verificador de status PIX
import { PIXStatusChecker } from "@/components/PIXStatusChecker";

// Mock events data - In a real app this would come from an API
const mockEvents = [
  {
    id: "1",
    title: "Show do Metallica",
    date: "2024-05-15",
    time: "20:00",
    location: "Allianz Parque - São Paulo, SP",
    areas: [
      { id: "pista", name: "Pista", price: 350.00 },
      { id: "pista_premium", name: "Pista Premium", price: 450.00 },
      { id: "camarote", name: "Camarote", price: 650.00 },
      { id: "arquibancada", name: "Arquibancada", price: 250.00 }
    ],
    classification: "16 anos",
    attraction: "Metallica",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "2",
    title: "Show do Iron Maiden",
    date: "2024-06-20",
    time: "21:00",
    location: "Morumbi - São Paulo, SP",
    areas: [
      { id: "pista", name: "Pista", price: 400.00 },
      { id: "pista_vip", name: "Pista VIP", price: 500.00 },
      { id: "camarote", name: "Camarote", price: 700.00 },
      { id: "arquibancada", name: "Arquibancada", price: 300.00 }
    ],
    classification: "16 anos",
    attraction: "Iron Maiden",
    imageUrl: "/placeholder.svg"
  }
];

const BuyTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [eventData, setEventData] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [showPixPayment, setShowPixPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>("");

  useEffect(() => {
    // Find the event in our mock data
    const event = mockEvents.find(event => event.id === id);
    if (!event) {
      toast.error("Evento não encontrado");
      navigate("/");
      return;
    }
    setEventData(event);
    // Seleciona a primeira área por padrão se existirem áreas
    if (event.areas && event.areas.length > 0) {
      setSelectedArea(event.areas[0].id);
    }
  }, [id, navigate]);

  if (!eventData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center">Carregando...</div>
        </main>
      </div>
    );
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const generateTicketData = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData.name || !userData.cpf) {
      toast.error("Por favor, faça login novamente com seus dados completos");
      navigate("/login");
      return null;
    }

    const now = new Date();
    return {
      ticketId: `TK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      securityCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      purchaseDate: now.toLocaleString('pt-BR'),
      eventTitle: eventData.title,
      eventDate: new Date(eventData.date).toLocaleDateString('pt-BR'),
      eventTime: eventData.time,
      location: eventData.location,
      area: eventData.area,
      buyerName: userData.name,
      buyerCpf: userData.cpf,
      buyerPhone: userData.phone
    };
  };

  const handlePixPayment = async () => {
    // Verificar se o usuário está logado
    if (!checkUserLoggedIn()) {
      return;
    }
    
    // Verificar se área foi selecionada
    if (!selectedArea) {
      toast.error("Por favor, selecione uma área primeiro.");
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (!userData.name || !userData.cpf) {
        toast.error("Por favor, faça login novamente com seus dados completos");
        navigate("/login");
        return;
      }
      
      // Encontrar a área selecionada para obter o preço
      const selectedAreaObj = eventData.areas.find((area: any) => area.id === selectedArea);
      if (!selectedAreaObj) {
        throw new Error("Área selecionada inválida");
      }

      console.log("Iniciando pagamento PIX...");
      
      // Simular criação de PIX já que a função pode não estar configurada
      // Em um ambiente real, você usaria:
      // const { data, error } = await supabase.functions.invoke('create-pix-payment', {...});
      
      // Simulação de PIX gerado
      const pixSimulationData = {
        success: true,
        qrCode: "00020101021226580014br.gov.bcb.pix2546pix@example.com5204000053039865802BR5923ISAPASS INGRESSO DIGITAL6009SAO PAULO62180514ORDER123456789630435C4",
        amount: selectedAreaObj.price * 100 * quantity,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        orderId: `order_${Date.now()}`
      };
      
      // Simulando sucesso do PIX
      setPixData(pixSimulationData);
      setShowPixPayment(true);
      toast.success("PIX gerado com sucesso! Escaneie o QR Code para pagar.");
      console.log("PIX gerado com sucesso:", pixSimulationData);

    } catch (error) {
      console.error("Erro ao processar pagamento PIX:", error);
      toast.error(`Erro ao gerar PIX: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCreditCardPayment = () => {
    // Simular processamento do cartão
    const ticket = generateTicketData();
    if (ticket) {
      setTicketData(ticket);
      setShowTicket(true);
      
      const purchase = {
        id: ticket.ticketId,
        eventTitle: eventData.title,
        date: eventData.date,
        price: eventData.price,
        ticket: ticket
      };
      
      const existingPurchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      const updatedPurchases = [...existingPurchases, purchase];
      localStorage.setItem('purchases', JSON.stringify(updatedPurchases));
      
      toast.success("Compra realizada com sucesso!");
    }
  };

  // Função para verificar se o usuário está logado
  const checkUserLoggedIn = () => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      toast.error("Você precisa estar logado para comprar ingressos!");
      navigate('/login');
      return false;
    }
    return true;
  };

  const handlePurchase = () => {
    // Verificar se o usuário está logado
    if (!checkUserLoggedIn()) {
      return;
    }
    
    // Verificar se área foi selecionada
    if (!selectedArea) {
      toast.error("Por favor, selecione uma área primeiro.");
      return;
    }

    if (paymentMethod === "pix") {
      handlePixPayment();
    } else {
      // Simular processamento de pagamento por cartão
      setIsProcessingPayment(true);
      
      setTimeout(() => {
        setIsProcessingPayment(false);
        setShowTicket(true);
        toast.success("Compra realizada com sucesso!");
      }, 2000);
    }
  };

  const copyPixCode = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const simulatePixPayment = () => {
    // Simular que o pagamento foi confirmado
    const ticket = generateTicketData();
    if (ticket) {
      setTicketData(ticket);
      setShowTicket(true);
      setShowPixPayment(false);
      
      const purchase = {
        id: ticket.ticketId,
        eventTitle: eventData.title,
        date: eventData.date,
        price: eventData.price,
        ticket: ticket,
        paymentMethod: 'PIX',
        pixOrderId: pixData?.orderId
      };
      
      const existingPurchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      const updatedPurchases = [...existingPurchases, purchase];
      localStorage.setItem('purchases', JSON.stringify(updatedPurchases));
      
      toast.success("Pagamento PIX confirmado! Ingresso gerado.");
    }
  };

  const getSelectedAreaPrice = () => {
    if (!eventData || !eventData.areas) return 0;
    const area = eventData.areas.find((area: any) => area.id === selectedArea);
    return area ? area.price : 0;
  };
  
  const totalPrice = getSelectedAreaPrice() * quantity || 0;

  if (showTicket && ticketData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <DigitalTicket {...ticketData} />
          <div className="flex justify-center mt-6">
            <Button onClick={() => navigate("/")}>Voltar para Home</Button>
          </div>
        </main>
      </div>
    );
  }

  if (showPixPayment && pixData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Dialog open={true}>
            <DialogContent className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto my-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-0 shadow-xl rounded-xl" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxHeight: '90vh', width: '90%', overflowY: 'auto' }}>
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#2ecc71] to-[#27ae60] rounded-t-xl">
                <div className="flex items-center h-full px-6">
                  <DialogTitle className="text-xl text-white font-bold">Pagamento PIX</DialogTitle>
                </div>
              </div>
              
              <div className="pt-12 px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    {pixData.qrCode && (
                      <div className="p-4 bg-white rounded-lg border shadow-sm">
                        <QRCodeSVG value={pixData.qrCode} size={200} />
                      </div>
                    )}
                    <p className="text-sm text-center font-medium text-gray-600 dark:text-gray-400">
                      Escaneie o QR Code com seu aplicativo bancário
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium mb-3">Detalhes do Pagamento</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-sm font-medium">Valor:</span>
                          <span className="font-bold text-lg text-green-600 dark:text-green-400">
                            R$ {(pixData.amount / 100).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-sm font-medium">Expira em:</span>
                          <span className="text-sm">
                            {pixData.expiresAt ? new Date(pixData.expiresAt).toLocaleString('pt-BR') : '15 minutos'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {pixData.qrCode && (
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-2">
                        <label className="text-sm font-medium">Código PIX:</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={pixData.qrCode}
                            readOnly
                            className="flex-1 p-2 text-xs border rounded font-mono bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={copyPixCode}
                            className="px-3"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verificador de Status de Pagamento PIX */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
                  <PIXStatusChecker
                    orderId={pixData.orderId}
                    onPaymentSuccess={simulatePixPayment}
                    onPaymentFailure={() => toast.error("Falha no pagamento. Tente novamente.")}
                    onPaymentExpired={() => {
                      toast.error("O tempo para pagamento expirou. Gere um novo PIX.");
                      setShowPixPayment(false);
                    }}
                  />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm space-y-4 mb-6">
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    O status do pagamento é verificado automaticamente. Você também pode confirmar manualmente após realizar o pagamento.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={simulatePixPayment}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-medium"
                    >
                      Confirmar Pagamento Manual
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPixPayment(false)}
                      className="w-full"
                    >
                      Voltar
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Dialog open={true}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{eventData.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-6">
            {/* Event Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={eventData.imageUrl} 
                  alt={eventData.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>{new Date(eventData.date).toLocaleDateString('pt-BR')} - {eventData.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{eventData.location}</span>
                </div>
                <div className="space-y-2">
                  <p><strong>Classificação:</strong> {eventData.classification}</p>
                  <p><strong>Atração:</strong> {eventData.attraction}</p>
                  
                  {/* Seleção de Área */}
                  <div className="mt-4">
                    <label className="font-medium mb-2 block">Área:</label>
                    <select 
                      className="w-full p-2 border rounded-md" 
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                    >
                      {eventData.areas.map((area: any) => (
                        <option key={area.id} value={area.id}>
                          {area.name} - R$ {area.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <p className="mt-2"><strong>Valor unitário:</strong> R$ {
                    eventData.areas.find((area: any) => area.id === selectedArea)?.price.toFixed(2) || "0.00"
                  }</p>
                </div>
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="flex items-center justify-between border-t pt-4">
              <span>Quantidade de Ingressos:</span>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Payment Section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Forma de Pagamento</h3>
              <Tabs defaultValue="credit" onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="credit">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Cartão de Crédito
                  </TabsTrigger>
                  <TabsTrigger value="pix">
                    <Scan className="h-4 w-4 mr-2" />
                    PIX
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="credit" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label>Número do Cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label>Validade</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label>CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="pix" className="space-y-4">
                  <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-gradient-to-br from-green-50 to-blue-50">
                    <Scan className="h-12 w-12 text-green-600" />
                    <div className="text-center">
                      <h4 className="font-semibold text-lg">Pagamento via PIX</h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Você receberá um QR Code para realizar o pagamento instantaneamente
                      </p>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm">✅ Aprovação instantânea</p>
                        <p className="text-sm">✅ Sem taxas adicionais</p>
                        <p className="text-sm">✅ Disponível 24h por dia</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Total Price */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-lg font-bold">R$ {
                    (eventData.areas.find((area: any) => area.id === selectedArea)?.price * quantity).toFixed(2) || "0.00"
                  }</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6 px-6 pb-6">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button 
              onClick={handlePurchase}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? "Processando..." : "Finalizar Compra"}
            </Button>
          </div>
        </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default BuyTicket;
