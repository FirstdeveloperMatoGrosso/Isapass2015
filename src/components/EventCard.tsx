import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Tag, Music, CreditCard, Minus, Plus, Copy, Check, X, Mail, Lock, User, Loader2, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/CustomDialogEventCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useRef, FormEvent, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import InputMask from "react-input-mask";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PIXStatusChecker } from "@/components/PIXStatusChecker";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  price: number;
  classification: string;
  areas: string[];
  attractions: string[];
}

export const EventCard = ({
  id,
  title,
  date,
  location,
  imageUrl,
  price,
  classification,
  areas,
  attractions
}: EventCardProps) => {
  // Extrair dia e mês da data
  const dateParts = date.split(' de ');
  const day = dateParts[0];
  const month = dateParts[1]?.split(',')[0];
  
  const navigate = useNavigate();
  
  // Estados
  const [showDetails, setShowDetails] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [showTicket, setShowTicket] = useState(false);
  const [showCustomerDataModal, setShowCustomerDataModal] = useState(false);
  const [showPixPayment, setShowPixPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [eventAreas, setEventAreas] = useState<Array<{id: string; name: string; price: number}>>([]);
  const [customerFormData, setCustomerFormData] = useState<{
    name: string;
    email: string;
    cpf: string;
    phone?: string;
  }>({ name: "", email: "", cpf: "", phone: "" });
  const [pixData, setPixData] = useState<{
    qrCodeValue: string;
    amount: number;
    expiresAt: string;
    orderId: string;
  } | null>(null);
  const [ticketData, setTicketData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginProcessing, setLoginProcessing] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);
  
  // Transformando a lista de áreas em um formato mais utilizável com preços
  useEffect(() => {
    const areasList = areas.map((area, index) => ({
      id: `area-${index}`,
      name: area,
      price: price + (index * 15)
    }));
    setEventAreas(areasList);
  }, [areas, price]);

  // Função para gerar dados do ticket após pagamento
  const generateTicketData = () => {
    const selectedAreaObj = eventAreas.find((area) => area.id === selectedArea);
    if (!selectedAreaObj) return null;

    return {
      id: `ticket_${Date.now()}`,
      eventId: id,
      eventTitle: title,
      date: date,
      location: location,
      area: selectedAreaObj.name,
      quantity: quantity,
      price: selectedAreaObj.price * quantity,
      customerName: customerFormData.name,
      customerEmail: customerFormData.email,
      customerCpf: customerFormData.cpf,
      paymentMethod: "pix",
      purchaseDate: new Date().toISOString(),
      status: "confirmed"
    };
  };
  
  // Função para alterar a quantidade
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };
  
  // Função para abrir o modal de compra
  const handleBuyClick = () => {
    setShowDetails(false);
    setShowBuyModal(true);
  };
  
  // Função para ir para o dashboard
  const goToDashboard = () => {
    navigate('/dashboard');
  };
  
  // Função para verificar se o usuário está logado
  const checkUserLoggedIn = () => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      toast.error("Você precisa estar logado para comprar ingressos!");
      // Em vez de redirecionar, mostrar diálogo de login
      setShowLoginDialog(true);
      return false;
    }
    return true;
  };
  
  // Função para lidar com o login no diálogo
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoginProcessing(true);
    
    // Simulando verificação de credenciais
    setTimeout(() => {
      // Credenciais de teste para simular login bem-sucedido
      if (loginEmail && loginPassword) {
        // Salvar dados do usuário no localStorage
        const userData = {
          name: "Usuário Teste",
          email: loginEmail,
          cpf: "123.456.789-00",
          phone: "(11) 98765-4321"
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        toast.success("Login realizado com sucesso!");
        setShowLoginDialog(false);
        setLoginEmail("");
        setLoginPassword("");
        
        // Executar a ação pendente (geração de PIX) que foi interrompida
        if (pendingActionRef.current) {
          pendingActionRef.current();
        }
      } else {
        toast.error("Email ou senha inválidos!");
      }
      setLoginProcessing(false);
    }, 1000);
  };


  // Função para lidar com a alteração nos campos do formulário
  const handleCustomerDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para iniciar o processo de pagamento PIX
  const handlePixPayment = () => {
    // Salvar essa função como a ação pendente caso o login seja necessário
    pendingActionRef.current = handlePixPayment;
    
    // Verificar se o usuário está logado
    if (!checkUserLoggedIn()) {
      return;
    }
    
    // Verificar se área foi selecionada
    if (!selectedArea) {
      toast.error("Por favor, selecione uma área primeiro.");
      return;
    }

    // Pré-preencher formulário com dados do localStorage, se disponíveis
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      setCustomerFormData({
        name: userData.name || '',
        email: userData.email || '',
        cpf: userData.cpf || '',
        phone: userData.phone || ''
      });
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }

    // Mostrar modal para confirmação/edição dos dados
    setShowCustomerDataModal(true);
  };

  // Função para remover máscaras e formatações dos campos
  const cleanFormattedData = (value: string) => {
    return value.replace(/[^a-zA-Z0-9@._-]/g, ''); // Remove caracteres especiais como pontos, traços, parênteses
  };

  // Função para gerar o pagamento PIX
  const generatePixPayment = async () => {
    // Obter a área selecionada
    const selectedAreaObj = eventAreas.find((area) => area.id === selectedArea);
    if (!selectedAreaObj) {
      throw new Error('Erro ao encontrar a área selecionada');
    }

    const totalAmount = selectedAreaObj.price * quantity;

    // Preparar dados para o PIX
    const pixPayload = {
      amount: totalAmount * 100, // Em centavos
      customer: {
        name: customerFormData.name.trim(),
        email: customerFormData.email.trim(),
        document: cleanFormattedData(customerFormData.cpf),
        phone: customerFormData.phone ? cleanFormattedData(customerFormData.phone) : '00000000000'
      },
      event: {
        partnerId: id,
        name: title,
        date: date,
        location: location,
        ticketType: selectedAreaObj.name,
        isHalfPrice: false
      }
    };

    console.log('Enviando dados para processamento de PIX:', pixPayload);

    try {
      // Fazer requisição para gerar PIX usando o proxy
      const response = await fetch('/api/payments/pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'test_token'}`
        },
        body: JSON.stringify(pixPayload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro na resposta da API:', errorData);
        throw new Error(errorData.message || 'Erro ao gerar pagamento PIX');
      }
      
      const responseData = await response.json();
      
      if (responseData.status === 'failed') {
        console.error('PIX não foi gerado:', responseData);
        throw new Error('Falha ao gerar PIX. Tente novamente.');
      }
      
      // Verificar se temos o QR Code na resposta
      if (!responseData.qrCode) {
        throw new Error('QR Code não encontrado na resposta');
      }
      
      console.log('PIX gerado com sucesso:', responseData);
      
      // Configurar dados do PIX para exibição
      setPixData({
        qrCodeValue: responseData.qrCode,
        amount: totalAmount,
        expiresAt: responseData.expiresAt || new Date(Date.now() + 30 * 60000).toISOString(),
        orderId: responseData.paymentId || `pix-${Date.now()}`
      });
      
      return true;
    } catch (error: any) {
      console.error('Erro ao processar pagamento PIX:', error);
      throw new Error(error.message || 'Erro ao processar pagamento PIX');
    }
  };

  // Função para processar os dados do cliente e gerar PIX
  const processPixPayment = async () => {
    try {
      // Validar formulário
      if (!customerFormData.name || !customerFormData.email || !customerFormData.cpf) {
        toast.error("Nome, email e CPF são obrigatórios");
        return;
      }

      // Validar formato de email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerFormData.email)) {
        toast.error("Por favor, informe um email válido");
        return;
      }

      // Validar formato de CPF (contando caracteres)
      const cpfDigits = cleanFormattedData(customerFormData.cpf);
      if (cpfDigits.length !== 11) {
        toast.error("Por favor, informe um CPF válido com 11 dígitos");
        return;
      }

      // Iniciar processamento
      setIsProcessingPayment(true);
      
      // Gerar o PIX
      const success = await generatePixPayment();
      
      if (success) {
        // Fechar modal de dados e abrir modal do PIX
        setShowCustomerDataModal(false);
        setShowPixPayment(true);
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      toast.error(error.message || 'Erro ao gerar pagamento PIX');
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  // Função para confirmar o pagamento PIX
  const confirmPixPayment = () => {
    // Criar o ticket após pagamento confirmado
    const selectedAreaObj = eventAreas.find((area) => area.id === selectedArea);
    if (!selectedAreaObj) return;

    const ticket = {
      id: `ticket_${Date.now()}`,
      eventId: id,
      eventTitle: title,
      eventDate: date,
      eventLocation: location,
      area: selectedAreaObj.name,
      price: selectedAreaObj.price,
      quantity: quantity,
      totalAmount: selectedAreaObj.price * quantity,
      purchaseDate: new Date().toISOString(),
      qrCodeValue: pixData?.qrCodeValue || '',
      orderId: pixData?.orderId || ''
    };

    setTicketData(ticket);
    setShowTicket(true);
    setShowBuyModal(false);
    setShowPixPayment(false);
    
    // Salvar ingresso nos dados do usuário
    const existingTickets = JSON.parse(localStorage.getItem('userTickets') || '[]');
    const updatedTickets = [...existingTickets, ticket];
    localStorage.setItem('userTickets', JSON.stringify(updatedTickets));
    
    toast.success("Pagamento PIX processado com sucesso!");
    navigate('/dashboard');
  };
  
  // Função para copiar código PIX
  const copyPixCode = () => {
    if (pixData?.qrCodeValue) {
      navigator.clipboard.writeText(pixData.qrCodeValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Código PIX copiado!");
    }
  };
  
  // Calcular o total baseado na área selecionada e quantidade
  const calculateTotal = () => {
    if (!selectedArea) return 0;
    const area = eventAreas.find((a) => a.id === selectedArea);
    return area ? area.price * quantity : 0;
  };

  // Formatação de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // RETORNO DO COMPONENTE - ÚNICO BLOCO DE RETURN
  return (
    <Card className="overflow-hidden rounded-xl shadow-md transition-all hover:shadow-lg w-full h-full flex flex-col bg-gradient-to-b from-white to-gray-50 hover:scale-[1.02] hover:shadow-xl hover:z-10">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-0 left-0 bg-gradient-to-r from-pink-500 to-pink-600 p-1 m-2 rounded-md shadow text-center">
          <div className="text-2xl font-bold text-white">{day}</div>
          <div className="text-xs uppercase text-pink-100">{month}</div>
        </div>
      </div>
      
      <CardContent className="flex-grow flex flex-col gap-3 p-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold truncate text-gray-800">{title}</h2>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
            <MapPin size={14} className="text-violet-500" />
            <span className="truncate">{location}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-indigo-500 text-sm">
          <Calendar size={14} className="text-violet-500" />
          <span>{date}</span>
        </div>
        
        <div className="flex items-center gap-1 text-indigo-500 text-sm">
          <Tag size={14} className="text-violet-500" />
          <span>{classification}</span>
        </div>
        
        <div className="flex items-center gap-1 text-indigo-500 text-sm">
          <Music size={14} className="text-violet-500" />
          <span className="truncate">{attractions.join(', ')}</span>
        </div>
        
        <div className="mt-auto pt-2">
          <div className="text-sm sm:text-base font-bold bg-gradient-to-r from-pink-500 to-pink-600 text-transparent bg-clip-text">
            A partir de {formatCurrency(price)}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2 p-4 pt-0">
        <Button 
          variant="outline" 
          onClick={() => setShowDetails(true)}
          className="flex-1 border-indigo-300 text-indigo-700 hover:bg-indigo-50 text-xs sm:text-sm px-2 sm:px-4"
        >
          Detalhes
        </Button>
        <Button 
          onClick={handleBuyClick}
          className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 transition-all"
        >
          Comprar
        </Button>
      </CardFooter>
      
      {/* Modal de Detalhes */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-60 object-cover rounded-lg"
              />
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="text-primary" />
                  <span>{date}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="text-primary" />
                  <span>{location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Tag className="text-primary" />
                  <span>{classification}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="text-primary" />
                  <span>Capacidade: 1000 pessoas</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Music className="text-primary" />
                  <span>Atrações: {attractions.join(', ')}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Sobre o Evento</h3>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl. Sed euismod, nunc vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl vel nisl.                
              </p>
              
              <h3 className="text-lg font-bold mt-4">Áreas Disponíveis</h3>
              <div className="space-y-2">
                {eventAreas.map((area) => (
                  <div key={area.id} className="flex justify-between items-center p-2 border rounded">
                    <span>{area.name}</span>
                    <span className="font-bold">{formatCurrency(area.price)}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={handleBuyClick}
                className="w-full mt-4 bg-pink-600 hover:bg-pink-700"
              >
                Comprar Ingresso
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Compra */}
      <Dialog open={showBuyModal} onOpenChange={setShowBuyModal}>
        <DialogContent className="max-w-md bg-gradient-to-b from-white to-gray-50 border border-indigo-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-indigo-800">Comprar Ingresso</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Evento</h3>
              <div className="flex items-center gap-2 p-2 border rounded">
                <div>
                  <div className="font-bold">{title}</div>
                  <div className="text-sm text-gray-500">{date} - {location}</div>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="area-select">Selecione a Área</Label>
              <Select 
                value={selectedArea} 
                onValueChange={setSelectedArea}
              >
                <SelectTrigger id="area-select" className="w-full">
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent>
                  {eventAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name} - {formatCurrency(area.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Quantidade</Label>
              <div className="flex items-center border rounded p-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </Button>
                <span className="flex-grow text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Forma de Pagamento</Label>
              <Tabs defaultValue="pix" className="w-full" value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="pix" className="flex items-center gap-2">
                    <CreditCard size={16} />
                    PIX
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
            
            <Button
              onClick={() => {
                if (!selectedArea) {
                  toast.error("Por favor, selecione uma área");
                  return;
                }
                setShowBuyModal(false);
                setShowCustomerDataModal(true);
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-pink-700 transition-all"
            >
              <div className="flex items-center gap-2">
                <CreditCard size={20} />
                <span>Pagar com PIX</span>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Dados do Cliente */}
      <Dialog open={showCustomerDataModal} onOpenChange={setShowCustomerDataModal}>
        <DialogContent className="sm:max-w-[500px] w-[95%] bg-white border-none p-4 shadow-xl rounded-lg">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-t-lg z-0"></div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-xl font-bold text-white mb-3 mt-1">Dados para Pagamento</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User size={16} /> Nome completo*
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerFormData.name}
                  onChange={handleCustomerDataChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail size={16} /> Email*
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerFormData.email}
                  onChange={handleCustomerDataChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="cpf" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User size={16} /> CPF*
              </label>
              <div className="relative">
                <InputMask
                  mask="999.999.999-99"
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={customerFormData.cpf}
                  onChange={handleCustomerDataChange}
                  placeholder="000.000.000-00"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  required
                />
              </div>
              <span className="text-xs text-gray-500 ml-1">Formato: 000.000.000-00</span>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone size={16} /> Telefone
              </label>
              <div className="relative">
                <InputMask
                  mask="(99) 99999-9999"
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerFormData.phone}
                  onChange={handleCustomerDataChange}
                  placeholder="(00) 00000-0000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                />
              </div>
              <span className="text-xs text-gray-500 ml-1">Formato: (00) 00000-0000</span>
            </div>
            
            <div className="pt-4">
              <Button
                type="button"
                onClick={async () => {
                  try {
                    // Validar campos obrigatórios
                    if (!customerFormData.name || !customerFormData.email || !customerFormData.cpf) {
                      toast.error("Por favor, preencha todos os campos obrigatórios");
                      return;
                    }

                    // Validar formato de email
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerFormData.email)) {
                      toast.error("Por favor, informe um email válido");
                      return;
                    }

                    // Validar CPF (mínimo 11 dígitos)
                    const cpfDigits = customerFormData.cpf.replace(/\D/g, '');
                    if (cpfDigits.length !== 11) {
                      toast.error("CPF deve conter 11 dígitos");
                      return;
                    }

                    setIsProcessingPayment(true);
                    
                    // Obter a área selecionada
                    const selectedAreaObj = eventAreas.find(area => area.id === selectedArea);
                    if (!selectedAreaObj) {
                      throw new Error('Área selecionada não encontrada');
                    }
                    
                    const totalAmount = selectedAreaObj.price * quantity;
                    
                    // Preparar payload para o PIX
                    const pixPayload = {
                      customerData: {
                        name: customerFormData.name.trim(),
                        email: customerFormData.email.trim(),
                        document: cpfDigits,
                        phone: customerFormData.phone ? customerFormData.phone.replace(/\D/g, '') : null
                      },
                      total: totalAmount,
                      metadata: {
                        order_id: `order_${Date.now()}`,
                        store_name: "IsaPass",
                        customer_id: cpfDigits,
                        product: `Ingresso - ${title} - ${selectedAreaObj.name}`,
                        quantity: quantity,
                        eventId: id,
                        eventTitle: title,
                        areaId: selectedArea,
                        areaName: selectedAreaObj.name,
                        userId: 'user-' + Date.now(),
                        partnerId: '1',
                        partnerName: 'IsaPass',
                        paymentType: 'pix'
                      }
                    };
                    
                    console.log('Enviando dados para PIX:', pixPayload);
                    
                    // Fazer requisição para a API de PIX
                    const response = await fetch('/api/payments/pix', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(pixPayload)
                    });
                    
                    if (!response.ok) {
                      const errorData = await response.json().catch(() => ({}));
                      console.error('Erro na API de pagamento:', errorData);
                      throw new Error(errorData.message || 'Erro ao processar pagamento');
                    }
                    
                    const data = await response.json();
                    
                    // Verificar se o PIX foi gerado com sucesso
                    if (!data.qrCode || !data.paymentId) {
                      throw new Error('Dados do PIX inválidos na resposta');
                    }
                    
                    // Atualizar estado com os dados do PIX
                    setPixData({
                      qrCodeValue: data.qrCode,
                      amount: totalAmount,
                      expiresAt: data.expiresAt || new Date(Date.now() + 30 * 60000).toISOString(),
                      orderId: data.paymentId
                    });
                    
                    // Fechar modal de dados e abrir modal de pagamento PIX
                    setShowCustomerDataModal(false);
                    setShowPixPayment(true);
                    
                    toast.success("PIX gerado com sucesso!");
                  } catch (err: any) {
                    console.error('Erro ao processar pagamento:', err);
                    toast.error(err.message || "Erro ao processar pagamento");
                  } finally {
                    setIsProcessingPayment(false);
                  }
                }}
                disabled={isProcessingPayment}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-pink-700 transition-all"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Gerando PIX...</span>
                  </div>
                ) : (
                  <span>Gerar PIX</span>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Pagamento PIX */}
      <Dialog open={showPixPayment} onOpenChange={setShowPixPayment}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[700px] w-[95%] max-h-[95vh] overflow-y-auto bg-white border-none p-4 shadow-xl rounded-lg">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-t-lg z-0"></div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-xl font-bold text-white mb-3 mt-1">Pagamento PIX</DialogTitle>
          </DialogHeader>
          
          {pixData && (
            <div className="space-y-3 flex flex-col items-center">
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2 font-medium">Escaneie o QR Code com seu aplicativo de banco</p>
                <div className="bg-white p-3 rounded-lg inline-block mx-auto shadow-md border-2 border-pink-200 w-full max-w-[220px]">
                  <QRCodeSVG value={pixData.qrCodeValue} size={180} bgColor="#FFFFFF" fgColor="#EC4899" className="w-full h-auto" />
                </div>
              </div>
              
              <div className="w-full bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-3 shadow-sm my-3">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-700 font-medium">Valor:</span>
                  <span className="text-base font-bold text-pink-600">{formatCurrency(pixData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700 font-medium">Expira em:</span>
                  <span className="text-sm font-mono text-pink-700 bg-pink-100 px-2 py-1 rounded">
                    {new Date(pixData.expiresAt).toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              </div>
              
              <div className="w-full">
                <p className="text-sm text-gray-700 mb-2 font-medium">Código PIX (Copia e Cola)</p>
                <div className="border border-pink-200 rounded-lg shadow-sm flex flex-col">
                  <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-3 text-sm font-mono text-gray-800 break-all overflow-x-auto whitespace-pre-wrap">
                    {pixData.qrCodeValue}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="p-2 w-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center" 
                    onClick={copyPixCode}
                  >
                    {copied ? <><Check size={16} className="text-green-600 mr-2" /> Copiado!</> : <><Copy size={16} className="mr-2" /> Copiar código PIX</>}
                  </Button>
                </div>
              </div>
              
              <div className="w-full border-t border-pink-200 pt-3 mt-3">
                <p className="text-sm mb-2 text-center font-bold text-white bg-gradient-to-r from-pink-500 to-pink-600 py-2 px-3 rounded-md shadow-sm">Status do Pagamento</p>
                <div className="bg-white border border-pink-200 rounded-lg p-2 shadow-sm text-sm">
                  <PIXStatusChecker 
                    orderId={pixData.orderId} 
                    onPaymentSuccess={confirmPixPayment}
                    onPaymentFailure={() => toast.error("Falha no pagamento. Tente novamente.")}
                    onPaymentExpired={() => toast.error("O pagamento expirou. Gere um novo código.")}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal de Ingresso */}
      <Dialog open={showTicket} onOpenChange={setShowTicket}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ingresso Confirmado</DialogTitle>
          </DialogHeader>
          
          {ticketData && (
            <div className="space-y-4">
              <div className="text-center bg-gray-50 py-4 rounded-lg">
                <div className="font-bold text-lg">{ticketData.eventTitle}</div>
                <div className="text-sm text-gray-500 mb-4">{ticketData.eventDate} | {ticketData.eventLocation}</div>
                <div className="bg-white p-4 rounded-lg inline-block mx-auto mb-2">
                  <QRCodeSVG value={ticketData.qrCodeValue} size={150} />
                </div>
                <div className="text-xs font-mono text-gray-500">{ticketData.id}</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Área:</span>
                  <span>{ticketData.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Quantidade:</span>
                  <span>{ticketData.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Valor:</span>
                  <span className="font-bold">{formatCurrency(ticketData.totalAmount)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={goToDashboard}
              >
                Ver Meus Ingressos
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal de Login */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Entrar na sua conta</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail size={16} /> E-mail
              </Label>
              <Input
                id="email"
                type="email" 
                placeholder="seu@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock size={16} /> Senha
              </Label>
              <Input 
                id="password"
                type="password"
                placeholder="Sua senha"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mt-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="rounded border-gray-300" />
                <Label htmlFor="remember" className="text-sm cursor-pointer">Lembrar de mim</Label>
              </div>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Esqueceu a senha?</Link>
            </div>
            
            <Button type="submit" className="w-full" disabled={loginProcessing}>
              {loginProcessing ? "Entrando..." : "Entrar"}
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              Não tem uma conta? <Link to="/register" className="text-primary hover:underline">Registre-se</Link>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal do PIX */}
      <Dialog open={showPixPayment} onOpenChange={setShowPixPayment}>
        <DialogContent className="sm:max-w-[500px] w-[95%] bg-white p-6 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Pagamento PIX</DialogTitle>
          </DialogHeader>

          {pixData && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">Valor a pagar:</p>
                <p className="text-2xl font-bold text-pink-600">{formatCurrency(pixData.amount)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center space-y-4">
                <QRCodeSVG value={pixData.qrCodeValue} size={200} />
                
                <Button
                  onClick={copyPixCode}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  {copied ? (
                    <>
                      <Check size={20} className="text-green-500" />
                      <span>Código Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      <span>Copiar Código PIX</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2 text-center text-sm text-gray-500">
                <p>Abra o app do seu banco e escaneie o QR Code ou cole o código PIX</p>
                <p>O pagamento será confirmado automaticamente</p>
                <p className="text-xs">Expira em: {new Date(pixData.expiresAt).toLocaleTimeString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EventCard;