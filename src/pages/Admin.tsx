
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart3, Calendar, CreditCard, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DashboardPage from "./admin/Dashboard";
import EventsPage from "./admin/Events";
import CustomersPage from "./admin/Customers";
import SalesPage from "./admin/Sales";
import ReportsPage from "./admin/Reports";
import ChatPage from "./admin/Chat";
import SettingsPage from "./admin/Settings";

const AdminPanel = () => {
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
    <Router>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Painel Administrativo</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link to={item.path} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          
          <main className="flex-1 p-6">
            <SidebarTrigger />
            <Routes>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/events" element={<EventsPage />} />
              <Route path="/admin/customers" element={<CustomersPage />} />
              <Route path="/admin/sales" element={<SalesPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/chat" element={<ChatPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
};

export default AdminPanel;
