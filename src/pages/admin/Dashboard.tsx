
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CreditCard, AlertTriangle } from "lucide-react";

const DashboardPage = () => {
  const stats = [
    {
      title: "Total de Clientes",
      value: "1,234",
      icon: Users,
      description: "↗︎ 12% desde o último mês"
    },
    {
      title: "Eventos Ativos",
      value: "23",
      icon: Calendar,
      description: "12 eventos este mês"
    },
    {
      title: "Vendas Totais",
      value: "R$ 45,231",
      icon: CreditCard,
      description: "↗︎ 7% desde o último mês"
    },
    {
      title: "Pedidos Pendentes",
      value: "45",
      icon: AlertTriangle,
      description: "20 aguardando pagamento"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
