import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Tag, Music, CreditCard, Minus, Plus, Copy, Check, X, Mail, Lock, User, Loader2, CheckCircle, Phone, Printer, Ticket as TicketIcon, RefreshCw } from "lucide-react";
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
  serviceFee?: number;
  classification: string;
  areas: string[];
  attractions: string[];
  isFirst?: boolean;
}

export const EventCard = ({
  id,
  title,
  date,
  location,
  imageUrl,
  price,
  serviceFee = 10, // Valor padrão de 10% se não definido
  classification,
  areas,
  attractions,
  isFirst = false
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
  
  // Estados para termos de uso e alertas
  const [showTermsModal, setShowTermsModal] = useState(true); // Modal de termos aparece automaticamente
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPaymentSuccessAlert, setShowPaymentSuccessAlert] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCodeValue: string;
    amount: number;
    expiresAt: string;
    orderId: string;
  } | null>(null);
  
  // Estados para controle de tempo e status do pagamento
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "approved" | "failed" | "paid">("pending");
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
  
  // Temporizador em tempo real para atualizar o tempo restante
  useEffect(() => {
    if (!pixData?.expiresAt) return;
    
    // Atualizar imediatamente
    setRemainingTime(formatExpirationTime(pixData.expiresAt));
    
    // Configurar intervalo para atualizar a cada segundo
    const timerInterval = setInterval(() => {
      const timeLeft = formatExpirationTime(pixData.expiresAt);
      setRemainingTime(timeLeft);
      
      // Se expirou, interromper o temporizador
      if (timeLeft === "Expirado") {
        clearInterval(timerInterval);
      }
    }, 1000);
    
    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(timerInterval);
  }, [pixData]);
  
  // Verificar status do pagamento a cada 3 segundos
  useEffect(() => {
    if (!pixData?.orderId || isPaymentCompleted) return;
    
    // Verificar imediatamente
    checkPaymentStatus();
    
    // Configurar intervalo para verificar a cada 3 segundos (mais frequente)
    const statusInterval = setInterval(() => {
      checkPaymentStatus();
    }, 3000);
    
    // Limpar o intervalo quando o componente for desmontado ou quando o pagamento for concluído
    return () => clearInterval(statusInterval);
  }, [pixData, isPaymentCompleted]);
  
  // Persistir status do pagamento no localStorage para evitar perda de estado
  useEffect(() => {
    // Se o pagamento for concluído, salvar no localStorage
    if (paymentStatus === 'paid') {
      localStorage.setItem(`payment_status_${pixData?.orderId}`, 'paid');
    }
  }, [paymentStatus, pixData?.orderId]);
  
  // Controle de login e termos
  useEffect(() => {
    if (isFirst) {
      // Verificar se os termos já foram aceitos
      const termsAcceptedBefore = localStorage.getItem('isapass_terms_accepted');
      if (termsAcceptedBefore) {
        setTermsAccepted(true);
      }
      
      // Verificar se já existe um login salvo
      const savedEmail = localStorage.getItem('isapass_user_email');
      const savedPassword = localStorage.getItem('isapass_user_password');
      
      // Dar um tempo para a página carregar completamente
      setTimeout(() => {
        if (savedEmail && savedPassword) {
          // Usuário já logado anteriormente
          handleAutoLogin(savedEmail, savedPassword);
        } else {
          // Se não há login salvo, mostrar a tela de login
          setShowLoginDialog(true);
        }
      }, 500);
    }
  }, [isFirst]);

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
  
  // Função para login automático
  const handleAutoLogin = async (email: string, password: string) => {
    try {
      setLoginProcessing(true);
      // Simulação de login - na vida real, seria uma chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados do usuário simulados
      const userData = {
        name: "Usuário IsaPass",
        email: email,
        cpf: "123.456.789-00",
        phone: "(11) 98765-4321"
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('isapass_user_email', email);
      localStorage.setItem('isapass_user_password', password); // Apenas para testes
      
      // Fechar o diálogo de login se estiver aberto
      setShowLoginDialog(false);
      
      // Verificar se os termos já foram aceitos, se não, mostrar após login
      const termsAcceptedBefore = localStorage.getItem('isapass_terms_accepted');
      if (!termsAcceptedBefore) {
        // Mostrar os termos apenas após o login e apenas uma vez
        setTimeout(() => {
          setShowTermsModal(true);
        }, 500);
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao fazer login automático:", error);
      toast.error("Erro ao fazer login automático.");
      return false;
    } finally {
      setLoginProcessing(false);
    }
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

  // Função para lidar com o envio do formulário de login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setLoginProcessing(true);
    
    try {
      // Simulação de login - na vida real, seria uma chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados do usuário simulados
      const userData = {
        name: "Usuário IsaPass",
        email: loginEmail,
        cpf: "123.456.789-00",
        phone: "(11) 98765-4321"
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('isapass_user_email', loginEmail);
      localStorage.setItem('isapass_user_password', loginPassword); // Nunca armazene senhas no localStorage em produção
      
      toast.success("Login realizado com sucesso!");
      
      // Fechar o diálogo de login
      setShowLoginDialog(false);
      
      // Verificar se os termos já foram aceitos
      const termsAccepted = localStorage.getItem('isapass_terms_accepted');
      if (!termsAccepted) {
        // Mostrar os termos apenas após o login
        setTimeout(() => {
          setShowTermsModal(true);
        }, 500);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Não foi possível realizar o login. Tente novamente.");
    } finally {
      setLoginProcessing(false);
    }
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
  
  // Função para limpar CPF/telefone (apenas números)
  const cleanNumericData = (value: string) => {
    return value?.replace(/\D/g, '') || '';
  };

  // Função para formatar o tempo de expiração do PIX
  const formatExpirationTime = (expiresAt: string) => {
    try {
      const expirationDate = new Date(expiresAt);
      const now = new Date();
      
      // Calcula a diferença em milissegundos
      const diffMs = expirationDate.getTime() - now.getTime();
      
      // Se já expirou
      if (diffMs <= 0) {
        return "Expirado";
      }
      
      // Converte para minutos e segundos
      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      
      // Formata os minutos e segundos com dois dígitos
      const formattedMins = diffMins.toString().padStart(2, '0');
      const formattedSecs = diffSecs.toString().padStart(2, '0');
      
      return `${formattedMins}:${formattedSecs}`;
    } catch (error) {
      console.error('Erro ao formatar tempo de expiração:', error);
      return "--:--";
    }
  };

  // Função para verificar o status do pagamento
  const checkPaymentStatus = async () => {
    if (isCheckingPayment || !pixData?.orderId) return;
    
    // Verificar primeiro no localStorage para evitar chamadas desnecessárias
    const savedStatus = localStorage.getItem(`payment_status_${pixData.orderId}`);
    if (savedStatus === 'paid') {
      if (!isPaymentCompleted) {
        setPaymentStatus('paid');
        setIsPaymentCompleted(true);
        setShowPixPayment(false); // Fecha o modal do PIX
        setShowPaymentSuccessAlert(true);
        setTimeout(() => {
          setShowPaymentSuccessAlert(false);
          generateTicketData(); // Gera os dados do ticket
          setShowTicket(true); // Mostra o ticket
        }, 3000);
      }
      return;
    }
    
    try {
      setIsCheckingPayment(true);
      toast.info("Verificando pagamento...");
      
      // Adicionar timestamp para evitar cache no navegador
      const response = await fetch(`/api/payments/status/${pixData.orderId}?_t=${Date.now()}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store'
        },
        cache: 'no-store' // Garantir que não use cache
      });
      
      if (!response.ok) {
        throw new Error('Erro ao verificar status do pagamento');
      }
      
      const data = await response.json();
      console.log('Status do pagamento:', data); // Log para depuração
      
      // Forçar uma verificação mais ampla dos status possíveis
      const paymentCompleted = 
        data.status === "paid" || 
        data.pagarme_status?.order === "paid" || 
        data.pagarme_status?.charge === "paid" || 
        data.pagarme_status?.transaction === "captured";
      
      // Verificar se o pagamento foi concluído baseado em qualquer indicação positiva
      if (paymentCompleted) {
        setPaymentStatus('paid');
        // Salvar no localStorage para persistência
        localStorage.setItem(`payment_status_${pixData.orderId}`, 'paid');
        
        toast.success("Pagamento confirmado!");
        setIsPaymentCompleted(true);
        setShowPixPayment(false); // Fecha o modal do PIX
        
        // Exibir alerta de pagamento concluído com sucesso
        setShowPaymentSuccessAlert(true);
        
        // Após 3 segundos, fechar o alerta e mostrar o ingresso
        setTimeout(() => {
          setShowPaymentSuccessAlert(false);
          generateTicketData(); // Gera os dados do ticket
          setShowTicket(true); // Mostra o ticket
        }, 3000);
      } else if (data.status === "failed" || data.status === "canceled") {
        setPaymentStatus("failed");
        toast.error("Pagamento não aprovado ou cancelado.");
      }
    } catch (error) {
      console.error("Erro ao verificar status de pagamento:", error);
    } finally {
      setIsCheckingPayment(false);
    }
  };

  // Funcção para gerar o pagamento PIX
  const generatePixPayment = async () => {
    // Obter a área selecionada
    const selectedAreaObj = eventAreas.find((area) => area.id === selectedArea);
    if (!selectedAreaObj) {
      throw new Error('Erro ao encontrar a área selecionada');
    }

    // Calcular valores
    const subtotal = selectedAreaObj.price * quantity;
    // Calcular taxa de serviço
    const serviceFeeAmount = subtotal * (serviceFee / 100);
    const totalAmount = subtotal + serviceFeeAmount;

    // Preparar dados para o PIX
    const pixPayload = {
      amount: Math.round(totalAmount * 100), // Em centavos
      subtotal: Math.round(subtotal * 100),
      serviceFee: Math.round(serviceFeeAmount * 100), // Valor total da taxa de serviço em centavos
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
        section: '', // Adicionado para compatibilidade com o backend
        row: '', // Adicionado para compatibilidade com o backend
        seat: '', // Adicionado para compatibilidade com o backend
        isHalfPrice: false
      }
    };

    console.log('Enviando dados para processamento de PIX:', pixPayload);

    try {
      // Fazer requisição para o servidor local que processa o pagamento PIX
      // Este endpoint é processado pelo servidor Deno na porta 8099
      const response = await fetch('/api/payments/pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pixPayload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro na resposta do servidor PIX:', errorData);
        throw new Error(errorData.error || 'Erro ao gerar pagamento PIX');
      }
      
      const responseData = await response.json();
      console.log('Resposta do servidor PIX:', responseData);
      
      console.log('Resposta completa do servidor:', responseData);
      
      // Extrair dados relevantes da resposta usando o formato correto do servidor
      const qrCode = responseData.pix?.qr_code;
      const qrCodeUrl = responseData.pix?.qr_code_url;
      const expiresAt = responseData.pix?.expires_at;
      const orderId = responseData.order_id;
      
      // Verificar status da resposta
      if (responseData.status === 'failed') {
        console.error('PIX não foi gerado:', responseData);
        throw new Error('Falha ao gerar PIX. Tente novamente.');
      }

      // Verificar se temos o QR Code na resposta
      if (!qrCode) {
        console.error('QR Code não retornado pelo servidor:', responseData);
        throw new Error('QR Code PIX não foi gerado corretamente. Tente novamente.');
      }
      
      // Configurar dados do PIX para exibição
      const pixDataToShow = {
        qrCodeValue: qrCode,
        amount: totalAmount,
        expiresAt: expiresAt || new Date(Date.now() + 30 * 60000).toISOString(),
        orderId: orderId || `pix-${Date.now()}`
      };
      
      console.log('Dados PIX processados com sucesso:', pixDataToShow);
      setPixData(pixDataToShow);
      setShowPixPayment(true);
      
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
      const cpfDigits = cleanNumericData(customerFormData.cpf);
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
    <Card className="overflow-hidden rounded-xl shadow-md transition-all hover:shadow-lg w-full flex flex-col bg-gradient-to-b from-white to-gray-50 hover:scale-[1.02] hover:shadow-xl hover:z-10 h-full">
      <div className="relative h-48 bg-gray-100">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 bg-gradient-to-r from-pink-500 to-pink-600 p-1 m-2 rounded-md shadow text-center">
          <div className="text-2xl font-bold text-white">{day}</div>
          <div className="text-xs uppercase text-pink-100">{month}</div>
        </div>
      </div>
      
      <CardContent className="flex-grow flex flex-col gap-2 p-4">
        <div className="min-h-[3.5rem]">
          <h2 className="text-base sm:text-lg font-bold line-clamp-2 text-gray-800">{title}</h2>
        </div>
        
        <div className="space-y-1.5 flex-grow">
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
            <MapPin size={14} className="text-violet-500 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          
          <div className="flex items-center gap-1 text-indigo-500 text-xs sm:text-sm">
            <Calendar size={14} className="text-violet-500 flex-shrink-0" />
            <span className="truncate">{date}</span>
          </div>
          
          <div className="flex items-center gap-1 text-indigo-500 text-xs sm:text-sm">
            <Tag size={14} className="text-violet-500 flex-shrink-0" />
            <span className="truncate">{classification}</span>
          </div>
          
          <div className="flex items-start gap-1 text-indigo-500 text-xs sm:text-sm">
            <Music size={14} className="text-violet-500 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{attractions.join(', ')}</span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="text-sm sm:text-base font-bold bg-gradient-to-r from-pink-500 to-pink-600 text-transparent bg-clip-text">
            A partir de {formatCurrency(price)}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2 p-4 pt-0 mt-auto border-t border-gray-100">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowDetails(true)}
          className="flex-1 border-indigo-300 text-indigo-700 hover:bg-indigo-50 text-xs sm:text-sm px-2 sm:px-4 h-9"
        >
          Detalhes
        </Button>
        <Button 
          size="sm"
          onClick={handleBuyClick}
          className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 transition-all h-9"
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
                    
                    // Validar dados do cliente antes de enviar
                    if (!customerFormData.name || customerFormData.name.trim() === "") {
                      throw new Error("Nome do cliente não pode estar vazio");
                    }
                    
                    if (!customerFormData.email || !customerFormData.email.includes("@")) {
                      throw new Error("Email do cliente inválido");
                    }
                    
                    // Verificar novamente o CPF com o formato correto
                    if (cleanNumericData(customerFormData.cpf).length !== 11) {
                      throw new Error("CPF inválido, deve ter 11 dígitos");
                    }
                    
                    // Limpar telefone - remover caracteres não numéricos
                    const cleanedPhone = customerFormData.phone ? cleanNumericData(customerFormData.phone) : "";
                    const phoneToSend = cleanedPhone.length >= 10 ? cleanedPhone : "11999999999";
                    
                    // Preparar os dados do pagamento com todos os dados do cliente
                    const pixPayload = {
                      amount: totalAmount,
                      customer: {
                        name: customerFormData.name.trim(),
                        email: customerFormData.email.trim(),
                        document: cleanNumericData(customerFormData.cpf),
                        phone: phoneToSend
                      },
                      event: {
                        name: title || "Evento IsaPass", // Usando o título do evento disponível no componente
                        date: date || new Date().toISOString(), // Usando a data do evento disponível no componente
                        location: location || "Local do Evento", // Usando a localização do evento disponível no componente
                        ticketType: selectedAreaObj.name, // Usando o nome da área como tipo de ingresso
                        section: "", // Enviando string vazia já que o objeto não possui essa propriedade
                        row: "", // Enviando string vazia já que o objeto não possui essa propriedade
                        seat: "", // Enviando string vazia já que o objeto não possui essa propriedade
                        partnerId: id || "isapass-" + Date.now(), // Usando o ID do evento como partnerId
                        isHalfPrice: false // Por padrão, não é meia-entrada
                      }
                    };
                    
                    console.log('Enviando dados completos para PIX:', JSON.stringify(pixPayload, null, 2));
                    console.log('Detalhes do cliente:', JSON.stringify(pixPayload.customer, null, 2));
                    
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
                    
                    console.log('Resposta completa do servidor PIX:', data);
                    
                    // Verificar se o PIX foi gerado com sucesso
                    // Servidor Deno retorna o QR code em data.pix.qr_code e o ID em data.order_id
                    if (!data.pix?.qr_code || !data.order_id) {
                      console.error('Formato inválido na resposta PIX:', data);
                      throw new Error('Dados do PIX inválidos na resposta');
                    }
                    
                    // Atualizar estado com os dados do PIX no formato correto
                    setPixData({
                      qrCodeValue: data.pix.qr_code,
                      amount: totalAmount,
                      expiresAt: data.pix.expires_at || new Date(Date.now() + 30 * 60000).toISOString(),
                      orderId: data.order_id
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
        <DialogContent className="max-w-md md:max-w-lg">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="text-xl text-primary font-bold">Seu Ingresso está Pronto</DialogTitle>
          </DialogHeader>
          
          {ticketData && (
            <div className="space-y-6">
              {/* Ticket Design - Baseado no modelo fornecido */}
              <div className="ticket-container rounded-lg overflow-hidden shadow-lg border border-primary/20">
                {/* Cabeçalho do Ticket */}
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4">
                  <h3 className="font-bold text-lg md:text-xl text-center">{ticketData.eventTitle}</h3>
                  <p className="text-xs text-center text-white/90">Ingresso Digital</p>
                </div>
                
                {/* Informações do Evento */}
                <div className="bg-white p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Data:</p>
                      <p>{ticketData.eventDate.split(',')[0]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 font-medium">Hora:</p>
                      <p>{ticketData.eventDate.split(',')[1]?.trim() || "20:00"}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Local:</p>
                      <p>{ticketData.eventLocation}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Área:</p>
                      <p className="font-medium">{ticketData.area}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 font-medium">Qtd:</p>
                      <p>{ticketData.quantity}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-dashed border-gray-200 my-3 pt-3">
                    <div className="grid grid-cols-1 gap-1 text-sm">
                      <div>
                        <p className="text-gray-500 font-medium">Nome:</p>
                        <p>{JSON.parse(localStorage.getItem('userData') || '{}').name || "Cliente"}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500 font-medium">CPF:</p>
                        <p>{JSON.parse(localStorage.getItem('userData') || '{}').cpf || "Não informado"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 font-medium">Tel:</p>
                        <p>{JSON.parse(localStorage.getItem('userData') || '{}').phone || "Não informado"}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                      <div>
                        <p className="text-gray-500 font-medium">ID:</p>
                        <p className="font-mono text-xs">{ticketData.id.substring(0, 8).toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 font-medium">Código:</p>
                        <p className="font-mono text-xs">{btoa(ticketData.id).substring(0, 6).toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-1">
                      <p className="font-medium">Compra:</p>
                      <p>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                  
                  {/* QR Code */}
                  <div className="flex justify-center items-center my-2">
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-2 rounded-md border">
                        <QRCodeSVG value={ticketData.qrCodeValue} size={150} />
                      </div>
                      <p className="text-xs text-center text-gray-500 mt-1">QR Code</p>
                    </div>
                  </div>
                  
                  {/* Código de Barras */}
                  <div className="flex justify-center mt-2">
                    <div className="flex flex-col items-center w-full">
                      <svg 
                        className="w-full h-16" 
                        viewBox="0 0 100 30" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Simulação simplificada de código de barras */}
                        {Array.from({length: 30}).map((_, i) => (
                          <rect 
                            key={i} 
                            x={i * 3} 
                            y="0" 
                            width={Math.random() > 0.5 ? 2 : 1} 
                            height="30" 
                            fill="#000"
                          />
                        ))}
                      </svg>
                      <p className="text-xs text-center text-gray-500">Código de Barras</p>
                    </div>
                  </div>
                  
                  <p className="text-2xs text-center text-gray-400 mt-3">
                    Este ingresso é pessoal e intransferível. Apresente este QR Code na entrada do evento.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-white" 
                  onClick={() => window.print()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg> 
                  Imprimir Ingresso
                </Button>
                
                <Button 
                  className="flex-1 bg-secondary hover:bg-secondary/90 text-white" 
                  onClick={goToDashboard}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                    <path d="M13 5v2"></path>
                    <path d="M13 17v2"></path>
                    <path d="M13 11v2"></path>
                  </svg> 
                  Meus Ingressos
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal de Login */}
      {isFirst && (
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
      )}
      
      {/* Modal de Termos de Uso */}
      {isFirst && (
        <Dialog open={showTermsModal} onOpenChange={(open) => {
          // O usuário só pode fechar se aceitar os termos
          if (!open && !termsAccepted) {
            toast.warning("Você precisa aceitar os termos para continuar.");
            return;
          }
          setShowTermsModal(open);
        }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Termos de Uso e Política de Privacidade</DialogTitle>
            </DialogHeader>
            
            <div className="terms-content max-h-[60vh] overflow-y-auto p-4 border rounded-md">
              <h4 className="text-xl font-semibold mb-4">Bem-vindo ao IsaPass!</h4>
              <p className="mb-4">Ao utilizar nosso serviço de compra de ingressos, você concorda com os seguintes termos:</p>
              
              <h5 className="text-lg font-semibold mt-4 mb-2">1. Uso do Serviço</h5>
              <p className="mb-3">O IsaPass oferece um serviço de venda de ingressos para eventos. Ao utilizar nosso serviço, você concorda em fornecer informações precisas e completas.</p>
              
              <h5 className="text-lg font-semibold mt-4 mb-2">2. Pagamentos</h5>
              <p className="mb-3">Todos os pagamentos são processados de forma segura através de nossa plataforma. Nós oferecemos diferentes métodos de pagamento, incluindo PIX.</p>
              
              <h5 className="text-lg font-semibold mt-4 mb-2">3. Política de Privacidade</h5>
              <p className="mb-3">Coletamos apenas as informações necessárias para processar sua compra e garantir uma experiência segura. Seus dados não serão compartilhados com terceiros.</p>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                  localStorage.setItem('isapass_terms_accepted', 'true');
                  // Se houver dados de login salvos, tenta fazer login automático
                  const savedEmail = localStorage.getItem('isapass_user_email');
                  const savedPassword = localStorage.getItem('isapass_user_password');
                  
                  if (savedEmail && savedPassword) {
                    setLoginEmail(savedEmail);
                    setLoginPassword(savedPassword);
                    handleAutoLogin(savedEmail, savedPassword);
                  } else {
                    // Se não há credenciais salvas, abrir o modal de login automaticamente
                    setTimeout(() => {
                      setShowLoginDialog(true);
                    }, 500); // Pequeno atraso para garantir que o modal de termos se feche primeiro
                  }
                }}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Aceitar e Continuar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Alerta de Pagamento Concluído */}
      {isFirst && showPaymentSuccessAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg animate-fade-in-up">
            <div className="mx-auto mb-4 h-20 w-20 flex items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Pagamento Concluído!</h2>
            <p className="mb-6">Seu ingresso já está disponível na sua área do cliente.</p>
          </div>
        </div>
      )}
      
      {/* Modal do PIX */}
      {isFirst && (
        <Dialog 
          open={showPixPayment} 
          onOpenChange={(open) => {
            // Só permite fechar o modal se o pagamento foi concluído
            if (!open && !isPaymentCompleted) {
              toast.warning("Aguarde a confirmação do pagamento ou cancele a operação");
              return;
            }
            setShowPixPayment(open);
          }}
        >
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

                {paymentStatus === "approved" ? (
                  <div className="py-6 text-center">
                    <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
                      <Check size={40} className="mx-auto mb-2" />
                      <h3 className="text-lg font-bold">Pagamento Aprovado!</h3>
                      <p>Seu ingresso está sendo gerado...</p>
                    </div>
                  </div>
                ) : (
                  <>
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
                      <p>O pagamento será verificado automaticamente a cada 5 segundos</p>
                      <div className="flex justify-center items-center gap-2">
                        <p className="text-sm font-medium">Tempo restante:</p>
                        <p className="text-sm font-bold text-pink-600">{remainingTime || formatExpirationTime(pixData.expiresAt)}</p>
                        {isCheckingPayment && (
                          <Loader2 className="h-4 w-4 animate-spin text-pink-600 ml-2" />
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <Button 
                        onClick={checkPaymentStatus}
                        disabled={isCheckingPayment}
                        className="w-full bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center gap-2"
                      >
                        {isCheckingPayment ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Verificando...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw size={16} />
                            <span>Verificar Pagamento</span>
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        onClick={() => {
                          setShowPixPayment(false);
                          setIsProcessingPayment(false);
                        }} 
                        className="w-full bg-red-100 hover:bg-red-200 text-red-700"
                      >
                        Cancelar Pagamento
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default EventCard;