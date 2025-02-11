
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Legend, Cell 
} from 'recharts';
import { ShareOptions } from "@/components/ShareOptions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const monthlyData = [
  { name: 'Jan', vendas: 4000, lucro: 2400, cancelamentos: 200 },
  { name: 'Fev', vendas: 3000, lucro: 1398, cancelamentos: 150 },
  { name: 'Mar', vendas: 2000, lucro: 9800, cancelamentos: 100 },
  { name: 'Abr', vendas: 2780, lucro: 3908, cancelamentos: 180 },
  { name: 'Mai', vendas: 1890, lucro: 4800, cancelamentos: 120 },
  { name: 'Jun', vendas: 2390, lucro: 3800, cancelamentos: 90 },
];

const ticketTypeData = [
  { name: 'VIP', value: 400, color: '#FF6B6B' },
  { name: 'Pista Premium', value: 300, color: '#4ECDC4' },
  { name: 'Pista', value: 300, color: '#45B7D1' },
  { name: 'Camarote', value: 200, color: '#96CEB4' },
];

const paymentMethodData = [
  { name: 'Cartão de Crédito', value: 600, color: '#6C5CE7' },
  { name: 'PIX', value: 400, color: '#A8E6CF' },
  { name: 'Boleto', value: 200, color: '#DCEDC1' },
];

const eventData = [
  { name: 'Show A', vendas: 1200 },
  { name: 'Show B', vendas: 900 },
  { name: 'Show C', vendas: 800 },
  { name: 'Show D', vendas: 700 },
  { name: 'Show E', vendas: 600 },
];

const ReportsPage = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">
            Visualize e analise o desempenho do seu negócio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShareOptions />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Total de Vendas", value: "R$ 24.460", change: "+12%" },
              { title: "Ticket Médio", value: "R$ 156", change: "+8%" },
              { title: "Taxa de Conversão", value: "2.4%", change: "+0.3%" },
              { title: "Cancelamentos", value: "3%", change: "-0.5%" },
              { title: "Vendas Online", value: "82%", change: "+5%" },
              { title: "Satisfação", value: "4.8/5", change: "+0.2" }
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{item.value}</p>
                    <span className={`text-xs ${
                      item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vendas vs Lucro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="vendas" 
                        stroke="hsl(var(--primary))" 
                        name="Vendas"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lucro" 
                        stroke="hsl(var(--secondary))" 
                        name="Lucro"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Ingresso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ticketTypeData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {ticketTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Formas de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taxa de Cancelamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="cancelamentos" 
                        stroke="#FF6B6B" 
                        name="Cancelamentos"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="vendas" fill="hsl(var(--primary))" name="Vendas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
