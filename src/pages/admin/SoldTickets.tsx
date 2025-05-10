
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Ticket, Download, Search, TicketX, RefreshCcw, Printer } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ShareOptions } from "@/components/ShareOptions";

interface SoldTicket {
  ticket_id: string;
  purchase_date: string;
  price: number;
  area: string | null;
  status: string;
  refund_status?: string;
  refund_date?: string;
  refund_amount?: number;
  event: {
    title: string;
    date: string;
  } | null;
  user_name?: string;
  user_email?: string;
}

const SoldTicketsPage = () => {
  const [tickets, setTickets] = useState<SoldTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [printData, setPrintData] = useState<SoldTicket | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        
        // Verificar primeiro se a coluna 'refund_status' existe na tabela
        // Para isso, vamos simplificar a consulta e depois adicionar os campos conforme necessário
        const { data, error } = await supabase
          .from("tickets")
          .select(`
            ticket_id, 
            purchase_date, 
            price, 
            area, 
            status,
            event_id,
            user_id,
            events:event_id (
              title,
              date
            )
          `)
          .order("purchase_date", { ascending: false });

        if (error) {
          console.error("Error fetching tickets:", error);
          setTickets([]);
          setIsLoading(false);
          return;
        }

        // Verificar se data é um array antes de continuar
        if (!Array.isArray(data)) {
          console.error("Expected array of tickets, got:", data);
          setTickets([]);
          setIsLoading(false);
          return;
        }

        // Getting user names separately to avoid the join error
        let ticketsWithUserInfo: SoldTicket[] = [];
        
        for (const ticket of data) {
          let userInfo = { user_name: "N/A", user_email: "N/A" };
          
          // Only try to get user info if user_id exists
          if (ticket.user_id) {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("name, email")
              .eq("id", ticket.user_id)
              .single();
              
            if (profileData) {
              userInfo = {
                user_name: profileData.name || "N/A",
                user_email: profileData.email || "N/A"
              };
            }
          }
          
          ticketsWithUserInfo.push({
            ticket_id: ticket.ticket_id,
            purchase_date: ticket.purchase_date,
            price: ticket.price,
            area: ticket.area,
            status: ticket.status || "active",
            event: ticket.events,
            ...userInfo
          });
        }

        setTickets(ticketsWithUserInfo);
      } catch (error) {
        console.error("Unexpected error:", error);
        setTickets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.event?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (ticket.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      ticket.ticket_id.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === "all" || 
      ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredTickets.reduce(
    (sum, ticket) => sum + (ticket.price || 0),
    0
  );

  // Como não temos as colunas de reembolso, vamos definir o total de reembolsos como zero
  const totalRefunds = 0;

  const exportToCsv = () => {
    const headers = ["ID", "Evento", "Cliente", "Email", "Data", "Preço", "Status"];
    
    const csvData = filteredTickets.map((ticket) => [
      ticket.ticket_id,
      ticket.event?.title || "N/A",
      ticket.user_name || "N/A",
      ticket.user_email || "N/A",
      ticket.purchase_date 
        ? format(new Date(ticket.purchase_date), "dd/MM/yyyy HH:mm") 
        : "N/A",
      `R$ ${ticket.price?.toFixed(2)}`,
      ticket.status
    ]);
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ingressos_vendidos_${format(new Date(), "dd-MM-yyyy")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printTicket = (ticket: SoldTicket) => {
    setPrintData(ticket);
    setTimeout(() => {
      window.print();
      setPrintData(null);
    }, 100);
  };

  return (
    <div className="p-4">
      {printData && (
        <div className="print-only">
          <div className="p-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">IsaPass</h1>
              <p>Comprovante de Ingresso</p>
            </div>
            
            <div className="border-t border-b py-4 my-6">
              <h2 className="text-xl font-bold">{printData.event?.title}</h2>
              <p className="text-sm text-gray-600">
                {printData.event?.date 
                  ? format(new Date(printData.event.date), "dd/MM/yyyy HH:mm")
                  : "Data não disponível"}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-600">Código do Ingresso</p>
                  <p className="font-mono">{printData.ticket_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Área</p>
                  <p>{printData.area || "Geral"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p>{printData.user_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p>{printData.status === "active" ? "Ativo" : printData.status === "used" ? "Utilizado" : "Cancelado"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valor</p>
                  <p>R$ {printData.price?.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm mt-8">
              <p>Documento gerado em {format(new Date(), "dd/MM/yyyy HH:mm")}</p>
              <p className="mt-2">www.isapass.com</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="print-hidden">
        <div className="flex flex-col gap-1 mb-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ingressos Vendidos</h2>
          <p className="text-muted-foreground">
            Gerenciar todos os ingressos vendidos para eventos
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Ingressos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  filteredTickets.length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Vendidos através do sistema
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  `R$ ${totalRevenue.toFixed(2)}`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Valor bruto das vendas de ingressos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ingressos Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  tickets.filter(t => t.status === "active").length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Ingressos válidos para uso
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Devoluções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  `R$ ${totalRefunds.toFixed(2)}`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Valor devolvido aos clientes
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Ingressos</CardTitle>
            <CardDescription>
              Todos os ingressos vendidos pela plataforma
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por evento, cliente ou código..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select 
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="used">Utilizados</SelectItem>
                    <SelectItem value="cancelled">Cancelados</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={exportToCsv}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <ShareOptions 
                  data={filteredTickets.map(ticket => ({
                    id: ticket.ticket_id,
                    evento: ticket.event?.title || "N/A",
                    cliente: ticket.user_name || "N/A",
                    email: ticket.user_email || "N/A",
                    data: ticket.purchase_date ? format(new Date(ticket.purchase_date), "dd/MM/yyyy HH:mm") : "N/A",
                    valor: `R$ ${ticket.price?.toFixed(2)}`,
                    status: ticket.status === "active" ? "Ativo" : ticket.status === "used" ? "Utilizado" : "Cancelado"
                  }))}
                  title="Ingressos Vendidos"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array(5).fill(null).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Evento</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data da Compra</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket) => (
                        <TableRow key={ticket.ticket_id}>
                          <TableCell className="font-mono text-xs">
                            {ticket.ticket_id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>{ticket.event?.title || "N/A"}</TableCell>
                          <TableCell>
                            <div>{ticket.user_name || "N/A"}</div>
                            <div className="text-xs text-muted-foreground">{ticket.user_email || "N/A"}</div>
                          </TableCell>
                          <TableCell>
                            {ticket.purchase_date
                              ? format(new Date(ticket.purchase_date), "dd/MM/yyyy HH:mm")
                              : "N/A"}
                          </TableCell>
                          <TableCell>R$ {ticket.price?.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                ticket.status === "active"
                                  ? "default"
                                  : ticket.status === "used"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {ticket.status === "active"
                                ? "Ativo"
                                : ticket.status === "used"
                                ? "Utilizado"
                                : "Cancelado"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                title="Imprimir Ingresso"
                                onClick={() => printTicket(ticket)}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Ticket className="h-12 w-12 mb-2 opacity-20" />
                            <p>Nenhum ingresso encontrado</p>
                            <p className="text-sm">Tente ajustar os filtros de busca</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <style>
        {`
        @media print {
          .print-hidden {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
        }
        @media screen {
          .print-only {
            display: none !important;
          }
        }
        `}
      </style>
    </div>
  );
};

export default SoldTicketsPage;
