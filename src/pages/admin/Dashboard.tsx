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
    <div className="p-6 bg-gradient-to-b from-background to-background/80 min-h-screen">
      <div className="flex flex-col gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card 
            key={stat.title}
            className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
          <CardHeader>
            <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {[1, 2, 3].map((item) => (
                <div 
                  key={item}
                  className="flex items-center gap-6 p-5 rounded-lg border border-primary/10 bg-gradient-to-r from-background/80 to-background hover:from-primary/5 hover:to-background transition-all duration-300 hover:border-primary/20 hover:shadow-sm"
                >
                  <div className="rounded-full p-2 bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
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

        <Card className="col-span-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
          <CardHeader>
            <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {[1, 2, 3].map((item) => (
                <div 
                  key={item}
                  className="flex items-center gap-6 p-5 rounded-lg border border-primary/10 bg-gradient-to-r from-background/80 to-background hover:from-primary/5 hover:to-background transition-all duration-300 hover:border-primary/20 hover:shadow-sm"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center transform group-hover:scale-105 transition-all duration-300">
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
