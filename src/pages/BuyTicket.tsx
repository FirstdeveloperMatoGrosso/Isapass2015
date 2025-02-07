
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { Calendar, MapPin, CreditCard, Scan, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DigitalTicket } from "@/components/DigitalTicket";

// Mock events data - In a real app this would come from an API
const mockEvents = [
  {
    id: "1",
    title: "Show do Metallica",
    date: "2024-05-15",
    time: "20:00",
    location: "Allianz Parque - São Paulo, SP",
    area: "Pista Premium",
    classification: "16 anos",
    attraction: "Metallica",
    price: 450.00,
    imageUrl: "/placeholder.svg"
  },
  {
    id: "2",
    title: "Show do Iron Maiden",
    date: "2024-06-20",
    time: "21:00",
    location: "Morumbi - São Paulo, SP",
    area: "Pista VIP",
    classification: "16 anos",
    attraction: "Iron Maiden",
    price: 500.00,
    imageUrl: "/placeholder.svg"
  }
];

const BuyTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [eventData, setEventData] = useState<any>(null);

  useEffect(() => {
    // Find the event in our mock data
    const event = mockEvents.find(event => event.id === id);
    if (!event) {
      toast.error("Evento não encontrado");
      navigate("/");
      return;
    }
    setEventData(event);
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

  const handlePurchase = () => {
    const ticket = generateTicketData();
    if (ticket) {
      setTicketData(ticket);
      setShowTicket(true);
      
      // Salvar a compra no localStorage
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

  const totalPrice = eventData.price * quantity;

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{eventData.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                <div>
                  <p><strong>Área:</strong> {eventData.area}</p>
                  <p><strong>Classificação:</strong> {eventData.classification}</p>
                  <p><strong>Atração:</strong> {eventData.attraction}</p>
                  <p><strong>Valor unitário:</strong> R$ {eventData.price.toFixed(2)}</p>
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
                  <div className="flex flex-col items-center space-y-4">
                    <img 
                      src="/placeholder.svg" 
                      alt="QR Code PIX"
                      className="w-48 h-48 border rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      Escaneie o QR Code acima com seu aplicativo de pagamento
                    </p>
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
                  <span className="text-lg font-bold">R$ {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button onClick={handlePurchase}>
              Finalizar Compra
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default BuyTicket;
