
import { useEffect, useState } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart3, Calendar, CreditCard, LayoutDashboard, MessageSquare, Settings, Users, ChevronLeft, ImageIcon } from "lucide-react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShareOptions } from "@/components/ShareOptions";
import DashboardPage from "./admin/Dashboard";
import EventsPage from "./admin/Events";
import CustomersPage from "./admin/Customers";
import SalesPage from "./admin/Sales";
import ReportsPage from "./admin/Reports";
import ChatPage from "./admin/Chat";
import SettingsPage from "./admin/Settings";
import BannersPage from "./admin/Banners";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    { title: "Banners", icon: ImageIcon, path: "/admin/banners" },
    { title: "Configurações", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background overflow-hidden">
        <Sidebar className={`hidden md:flex h-screen flex-col fixed left-0 top-0 z-20 border-r bg-card transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
          <SidebarContent>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </Button>
            <SidebarGroup>
              <SidebarGroupLabel className={`flex items-center gap-2 text-lg font-bold px-4 py-2 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                </div>
                {!isCollapsed && <span>Admin Panel</span>}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.path} 
                          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent transition-all duration-200 group"
                          onClick={() => {
                            toast({
                              title: `Navegando para ${item.title}`,
                              description: "Carregando página...",
                            });
                          }}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background group-hover:bg-primary/10 transition-colors">
                            <item.icon className="h-5 w-5 group-hover:text-primary transition-colors" />
                          </div>
                          {!isCollapsed && <span className="font-medium">{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-6 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="md:hidden">
              <SidebarTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10" />
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground hidden sm:inline-block">
                  Bem-vindo(a), Admin
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
            <ShareOptions />
            <div className="mx-auto max-w-7xl">
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/banners" element={<BannersPage />} />
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
