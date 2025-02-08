
import { useEffect } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart3, Calendar, CreditCard, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DashboardPage from "./admin/Dashboard";
import EventsPage from "./admin/Events";
import CustomersPage from "./admin/Customers";
import SalesPage from "./admin/Sales";
import ReportsPage from "./admin/Reports";
import ChatPage from "./admin/Chat";
import SettingsPage from "./admin/Settings";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { title: "Eventos", icon: Calendar, path: "/admin/events" },
    { title: "Clientes", icon: Users, path: "/admin/customers" },
    { title: "Vendas", icon: CreditCard, path: "/admin/sales" },
    { title: "Relatórios", icon: BarChart3, path: "/admin/reports" },
    { title: "Chat Bot", icon: MessageSquare, path: "/admin/chat" },
    { title: "Configurações", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background overflow-hidden">
        <Sidebar className="hidden md:flex flex-col border-r bg-card">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-lg font-bold px-4 py-2">
                Painel Administrativo
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.path} 
                          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                          onClick={() => {
                            toast({
                              title: `Navegando para ${item.title}`,
                              description: "Carregando página...",
                            });
                          }}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <div className="flex items-center justify-between p-4 md:p-6 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="md:hidden">
              <SidebarTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10" />
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Bem-vindo(a), Admin
              </span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
            <div className="mx-auto max-w-7xl">
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
