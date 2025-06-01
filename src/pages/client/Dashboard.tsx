import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { PIXPaymentStatus } from '../../components/PIXPaymentStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { CalendarIcon, TicketIcon, QrCodeIcon, Share2Icon } from 'lucide-react';

interface Ticket {
  id: string;
  eventName: string;
  eventDate: string;
  ticketType: string;
  section?: string;
  row?: string;
  seat?: string;
  qrCode: string;
  status: 'valid' | 'used' | 'expired';
}

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Simular carregamento de ingressos (em produção, isso seria uma API real)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Dados de exemplo
      const demoTickets: Ticket[] = [
        {
          id: 'tick_123456',
          eventName: 'Metallica World Tour 2024',
          eventDate: '2024-07-15T20:00:00Z',
          ticketType: 'VIP',
          section: 'Pista Premium',
          row: 'A',
          seat: '15',
          qrCode: 'iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAEsElEQVR4nO2UQW4DMQwD/f8/O0dRE0SxHWtwOHn0xYgS',
          status: 'valid'
        },
        {
          id: 'tick_789012',
          eventName: 'Iron Maiden Legacy Tour',
          eventDate: '2024-08-20T21:00:00Z',
          ticketType: 'ARQUIBANCADA',
          section: 'Setor A',
          row: '10',
          seat: '22',
          qrCode: 'iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAEsElEQVR4nO2UQW4DMQwD/f8/O0dRE0SxHWtwOHn0xYgS',
          status: 'valid'
        }
      ];
      setTickets(demoTickets);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Funções para lidar com pagamentos PIX
  const handlePaymentSuccess = () => {
    console.log("Pagamento confirmado!");
    setShowPaymentStatus(false);
    // Atualizar lista de ingressos
  };

  const handlePaymentFailure = () => {
    console.log("Falha no pagamento!");
    setShowPaymentStatus(false);
  };

  const handlePaymentExpired = () => {
    console.log("Pagamento expirado!");
    setShowPaymentStatus(false);
  };

  // Função para compartilhar ingresso
  const shareTicket = (ticket: Ticket) => {
    if (navigator.share) {
      navigator.share({
        title: `Ingresso para ${ticket.eventName}`,
        text: `Meu ingresso para ${ticket.eventName} em ${new Date(ticket.eventDate).toLocaleDateString('pt-BR')}`,
        url: window.location.href,
      })
      .catch((error) => console.log('Erro ao compartilhar:', error));
    } else {
      alert('Compartilhamento não suportado neste navegador');
    }
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      dateFormatted: date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      timeFormatted: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      fullFormatted: date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  return (
    <ClientLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Meus Ingressos
            </h1>
            <p className="text-gray-600 mt-1">Gerencie todos os seus ingressos adquiridos</p>
          </div>
          <Button 
            onClick={() => navigate('/')} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
            size="lg"
          >
            <TicketIcon className="mr-2 h-4 w-4" />
            Comprar Ingressos
          </Button>
        </div>

        {showPaymentStatus && (
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100 mb-6 animate-pulse">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <span className="bg-blue-500 rounded-full h-2 w-2 mr-2 animate-ping"></span>
              Aguardando pagamento
            </h2>
            <p className="mb-4 text-gray-600">Seu pagamento PIX está sendo processado. Não feche esta janela.</p>
            <PIXPaymentStatus 
              orderId={orderId}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailure={handlePaymentFailure}
              onPaymentExpired={handlePaymentExpired}
            />
          </div>
        )}

        {isLoading ? (
          // Esqueleto de carregamento
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mx-auto bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mb-6">
              <TicketIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum ingresso encontrado</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Você ainda não possui ingressos. Explore os eventos disponíveis e adquira seu ingresso!</p>
            <Button 
              onClick={() => navigate('/client/events')} 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            >
              Explorar Eventos
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Próximos Eventos
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Eventos Passados
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets.map((ticket) => {
                  const dateInfo = formatDate(ticket.eventDate);
                  return (
                    <div key={ticket.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{ticket.eventName}</h3>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {ticket.status === 'valid' ? 'Válido' : ticket.status === 'used' ? 'Utilizado' : 'Expirado'}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span className="text-sm">{dateInfo.dateFormatted} - {dateInfo.timeFormatted}</span>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium text-gray-900 mb-1">{ticket.ticketType}</p>
                          {ticket.section && (
                            <p className="text-xs text-gray-600">
                              {ticket.section}
                              {ticket.row && ticket.seat ? ` • Fileira ${ticket.row}, Assento ${ticket.seat}` : ''}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="default" 
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                <QrCodeIcon className="h-4 w-4 mr-2" />
                                Mostrar QR Code
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-center">
                                  Ingresso Digital
                                </DialogTitle>
                              </DialogHeader>
                              
                              {selectedTicket && (
                                <div className="flex flex-col items-center p-4">
                                  <div className="bg-blue-50 w-full rounded-lg p-4 mb-6 text-center">
                                    <h3 className="font-bold text-lg mb-1 text-gray-900">{selectedTicket.eventName}</h3>
                                    <p className="text-gray-600 text-sm">
                                      {formatDate(selectedTicket.eventDate).fullFormatted}
                                    </p>
                                  </div>
                                  
                                  <div className="relative mb-6 bg-white p-3 rounded-lg border-2 border-gray-200">
                                    <img 
                                      src={`data:image/png;base64,${selectedTicket.qrCode}`} 
                                      alt="QR Code"
                                      className="w-64 h-64"
                                    />
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2">
                                      <img src="/logo.png" alt="IsaPass" className="h-10 w-10" />
                                    </div>
                                  </div>
                                  
                                  <div className="text-center bg-gray-50 p-3 rounded-lg w-full">
                                    <p className="font-medium text-gray-900 mb-1">{selectedTicket.ticketType}</p>
                                    {selectedTicket.section && (
                                      <p className="text-sm text-gray-600">
                                        {selectedTicket.section}
                                        {selectedTicket.row && selectedTicket.seat ? ` • Fileira ${selectedTicket.row}, Assento ${selectedTicket.seat}` : ''}
                                      </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">
                                      ID: {selectedTicket.id}
                                    </p>
                                  </div>
                                  
                                  <Button 
                                    className="mt-4 w-full"
                                    variant="outline"
                                    onClick={() => shareTicket(selectedTicket)}
                                  >
                                    <Share2Icon className="h-4 w-4 mr-2" />
                                    Compartilhar Ingresso
                                  </Button>
                                  
                                  <p className="text-xs text-center text-gray-500 mt-4">
                                    Este QR Code é único e pessoal. Não compartilhe com estranhos.
                                  </p>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => shareTicket(ticket)}
                          >
                            <Share2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="past" className="mt-0">
              <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500">Nenhum evento passado encontrado</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
