
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
import { Ticket, Download, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface SoldTicket {
  ticket_id: string;
  purchase_date: string;
  price: number;
  area: string | null;
  status: string;
  event: {
    title: string;
    date: string;
  } | null;
  user: {
    name: string;
    email: string;
  } | null;
}

const SoldTicketsPage = () => {
  const [tickets, setTickets] = useState<SoldTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        
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
            ),
            profiles:user_id (
              name,
              email
            )
          `)
          .order("purchase_date", { ascending: false });

        if (error) {
          console.error("Error fetching tickets:", error);
          return;
        }

        const formattedTickets: SoldTicket[] = data.map((ticket) => ({
          ticket_id: ticket.ticket_id,
          purchase_date: ticket.purchase_date,
          price: ticket.price,
          area: ticket.area,
          status: ticket.status || "active",
          event: ticket.events,
          user: ticket.profiles,
        }));

        setTickets(formattedTickets);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.event?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const exportToCsv = () => {
    const headers = ["ID", "Evento", "Cliente", "Email", "Data", "Preço", "Status"];
    
    const csvData = filteredTickets.map((ticket) => [
      ticket.ticket_id,
      ticket.event?.title || "N/A",
      ticket.user?.name || "N/A",
      ticket.user?.email || "N/A",
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

  return (
    <div className="p-4">
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ingressos Vendidos</h2>
        <p className="text-muted-foreground">
          Gerenciar todos os ingressos vendidos para eventos
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
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
            <div className="flex gap-2">
              <Select 
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
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
                          <div>{ticket.user?.name || "N/A"}</div>
                          <div className="text-xs text-muted-foreground">{ticket.user?.email}</div>
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
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
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
  );
};

export default SoldTicketsPage;
