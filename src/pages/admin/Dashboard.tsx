
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CreditCard, AlertTriangle } from "lucide-react";

const DashboardPage = () => {
  const stats = [
    {
      title: "Total de Clientes",
      value: "1,234",
      icon: Users,
      description: "↗︎ 12% desde o último mês",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Eventos Ativos",
      value: "23",
      icon: Calendar,
      description: "12 eventos este mês",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Vendas Totais",
      value: "R$ 45,231",
      icon: CreditCard,
      description: "↗︎ 7% desde o último mês",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Pedidos Pendentes",
      value: "45",
      icon: AlertTriangle,
      description: "20 aguardando pagamento",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle
        </p>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
            <div className="space-y-4">
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
