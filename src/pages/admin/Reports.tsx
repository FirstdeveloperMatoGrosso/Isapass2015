
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Legend, Cell 
} from 'recharts';
import { ShareOptions } from "@/components/ShareOptions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, CreditCard, BarChart2 as BarChartIcon, Star } from 'lucide-react';

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
    <div className="p-8 bg-gradient-to-b from-background to-background/80 min-h-screen">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Relatórios</h2>
            <p className="text-muted-foreground text-lg">
              Visualize e analise o desempenho do seu negócio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShareOptions data={monthlyData} title="Relatório de Vendas" />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {[
                { title: 'Total de Vendas', value: 'R$ 24.460', change: '+12%', icon: TrendingUp },
                { title: 'Ticket Médio', value: 'R$ 156', change: '+8%', icon: CreditCard },
                { title: 'Taxa de Conversão', value: '2.4%', change: '+0.3%', icon: BarChartIcon },
                { title: 'Cancelamentos', value: '3%', change: '-0.5%', icon: TrendingUp },
                { title: 'Vendas Online', value: '82%', change: '+5%', icon: CreditCard },
                { title: 'Satisfação', value: '4.8/5', change: '+0.2', icon: Star }
              ].map((item) => (
                <Card key={item.title} className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium text-muted-foreground">{item.title}</p>
                      <div className="rounded-full p-1.5 bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl font-bold text-primary">{item.value}</p>
                      <span className={`text-xs font-medium ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Vendas vs Lucro</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#666" opacity={0.2} />
                        <XAxis 
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: '#666', opacity: 0.2 }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: '#666', opacity: 0.2 }}
                          width={60}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="vendas" 
                          stroke="#4ECDC4" 
                          name="Vendas"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="lucro" 
                          stroke="#45B7D1" 
                          name="Lucro"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Tipos de Ingresso</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ticketTypeData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
              <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Formas de Pagamento</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

              <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Taxa de Cancelamento</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#666" opacity={0.2} />
                        <XAxis 
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: '#666', opacity: 0.2 }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: '#666', opacity: 0.2 }}
                          width={60}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cancelamentos" 
                          stroke="#FF6B6B" 
                          name="Cancelamentos"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
              <CardHeader className="p-6">
                <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Vendas por Evento</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="h-[300px] md:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                    <BarChart data={eventData} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#666" opacity={0.2} />
                      <XAxis 
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: '#666', opacity: 0.2 }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: '#666', opacity: 0.2 }}
                        width={60}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: 'none',
                          borderRadius: '4px',
                          color: '#fff'
                        }}
                      />
                      <Bar 
                        dataKey="vendas" 
                        fill="hsl(var(--primary))" 
                        name="Vendas"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsPage;
