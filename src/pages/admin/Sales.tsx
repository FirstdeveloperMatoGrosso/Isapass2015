
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, AlertTriangle, TrendingUp, ShoppingCart, XCircle } from "lucide-react";
import { ShareOptions } from "@/components/ShareOptions";
import { Badge } from "@/components/ui/badge";

interface Sale {
  id: string;
  eventTitle: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
  buyer: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
  };
  ticketInfo: {
    area: string;
    quantity: number;
  };
}

const mockSales: Sale[] = [
  {
    id: "PED001",
    eventTitle: "Show do Metallica",
    amount: 450.00,
    status: 'completed',
    date: "2024-02-25T14:30:00",
    buyer: {
      name: "João Silva",
      email: "joao@email.com",
      cpf: "123.456.789-00",
      phone: "(11) 98765-4321"
    },
    ticketInfo: {
      area: "Pista Premium",
      quantity: 1
    }
  },
  {
    id: "PED002",
    eventTitle: "Festival de Verão",
    amount: 300.00,
    status: 'cancelled',
    date: "2024-02-24T16:45:00",
    buyer: {
      name: "Maria Santos",
      email: "maria@email.com",
      cpf: "987.654.321-00",
      phone: "(11) 91234-5678"
    },
    ticketInfo: {
      area: "Área VIP",
      quantity: 2
    }
  },
  {
    id: "PED003",
    eventTitle: "Show do Iron Maiden",
    amount: 350.00,
    status: 'pending',
    date: "2024-02-25T10:15:00",
    buyer: {
      name: "Pedro Oliveira",
      email: "pedro@email.com",
      cpf: "456.789.123-00",
      phone: "(11) 94567-8901"
    },
    ticketInfo: {
      area: "Pista",
      quantity: 1
    }
  }
];

const SalesPage = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Vendas</h2>
          <p className="text-muted-foreground">
            Gerencie suas vendas e acompanhe o desempenho
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShareOptions />
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vendas
            </CardTitle>
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">R$ 45.231</div>
            <p className="text-xs text-muted-foreground">
              +7% desde o último mês
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Pendentes
            </CardTitle>
            <div className="p-2 rounded-full bg-orange-100 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">45</div>
            <p className="text-xs text-muted-foreground">
              20 aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conversão
            </CardTitle>
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">2.4%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ticket Médio
            </CardTitle>
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">R$ 156</div>
            <p className="text-xs text-muted-foreground">
              +12% desde o último mês
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vendas Canceladas
            </CardTitle>
            <div className="p-2 rounded-full bg-red-100 text-red-600">
              <XCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">12</div>
            <p className="text-xs text-muted-foreground">
              3% do total de vendas
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Últimas Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSales.map((sale) => (
                <div 
                  key={sale.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 transition-colors hover:bg-accent/50"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Pedido #{sale.id}
                      </p>
                      <Badge
                        variant={
                          sale.status === 'completed' 
                            ? 'default' 
                            : sale.status === 'pending' 
                              ? 'secondary' 
                              : 'destructive'
                        }
                      >
                        {sale.status === 'completed' 
                          ? 'Concluído' 
                          : sale.status === 'pending' 
                            ? 'Pendente' 
                            : 'Cancelado'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {sale.eventTitle} - {sale.ticketInfo.area}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <p className="font-medium">Comprador:</p>
                        <p className="text-muted-foreground">{sale.buyer.name}</p>
                        <p className="text-muted-foreground">{sale.buyer.email}</p>
                        <p className="text-muted-foreground">CPF: {sale.buyer.cpf}</p>
                        <p className="text-muted-foreground">Tel: {sale.buyer.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R$ {sale.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(sale.date).toLocaleString('pt-BR')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sale.ticketInfo.quantity} {sale.ticketInfo.quantity === 1 ? 'ingresso' : 'ingressos'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesPage;
