
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CreditCard, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DashboardPage = () => {
  const [statsData, setStatsData] = useState({
    totalCustomers: "0",
    activeEvents: "0",
    totalSales: "0",
    pendingOrders: "0"
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch profiles count
        const { count: profilesCount, error: profilesError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        // Fetch active events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .gte('date', new Date().toISOString());
        
        // Fetch tickets for total sales
        const { data: tickets, error: ticketsError } = await supabase
          .from('tickets')
          .select('price');
        
        // Calculate total sales
        const totalSales = tickets?.reduce((sum, ticket) => sum + (ticket.price || 0), 0) || 0;
        
        // Set dashboard data
        setStatsData({
          totalCustomers: profilesCount?.toString() || "0",
          activeEvents: events?.length?.toString() || "0",
          totalSales: `R$ ${totalSales.toFixed(2)}`,
          pendingOrders: "0" // We don't have pending orders in our current schema
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total de Clientes",
      value: statsData.totalCustomers,
      icon: Users,
      description: "Usuários registrados",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Eventos Ativos",
      value: statsData.activeEvents,
      icon: Calendar,
      description: "Eventos futuros",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Vendas Totais",
      value: statsData.totalSales,
      icon: CreditCard,
      description: "Vendas de ingressos",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Pedidos Pendentes",
      value: statsData.pendingOrders,
      icon: AlertTriangle,
      description: "Aguardando processamento",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col gap-1 mb-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle
        </p>
      </div>
      
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        {stats.map((stat) => (
          <Card 
            key={stat.title} 
            className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div 
                  key={item}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card/50 transition-colors hover:bg-accent/50"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Novo pedido realizado
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Há 5 minutos
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div 
                  key={item}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card/50 transition-colors hover:bg-accent/50"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Show de Rock
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Amanhã às 20:00
                    </p>
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

export default DashboardPage;
