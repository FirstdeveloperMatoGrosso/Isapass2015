
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { BarChart3, Calendar, CreditCard, LayoutDashboard, MessageSquare, Settings, Users, ChevronLeft, ImageIcon, Link2, Ticket, FileText, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const AdminSidebar = ({ isCollapsed, setIsCollapsed }: AdminSidebarProps) => {
  const { toast } = useToast();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { title: "Eventos", icon: Calendar, path: "/admin/events" },
    { title: "Clientes", icon: Users, path: "/admin/customers" },
    { title: "Vendas", icon: CreditCard, path: "/admin/sales" },
    { title: "Ingressos Vendidos", icon: Ticket, path: "/admin/sold-tickets" },
    { title: "Relatórios", icon: BarChart3, path: "/admin/reports" },
    { title: "Chat Bot", icon: MessageSquare, path: "/admin/chat" },
    { title: "Banners", icon: ImageIcon, path: "/admin/banners" },
    { title: "API Connect", icon: Link2, path: "/admin/api-connect" },
    { title: "API Ingressos", icon: Ticket, path: "/admin/tickets-api" },
    { title: "API Fichas", icon: FileText, path: "/admin/tokens-api" },
    { title: "Configurações", icon: Settings, path: "/admin/settings" },
  ];

  const isActive = (path: string) => currentPath === path;

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    toast({
      title: isCollapsed ? "Menu expandido" : "Menu recolhido",
      duration: 1500,
    });
  };

  return (
    <Sidebar className={`fixed h-screen transition-all duration-300 border-r bg-card ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <SidebarContent className="flex flex-col h-full">
        <div className="pt-4 px-3">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent rounded-full"
            onClick={handleCollapse}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className={`flex items-center gap-2 text-lg font-bold px-3 mt-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#D946EF]/20 to-[#0EA5E9]/20">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            {!isCollapsed && <span className="bg-gradient-to-r from-[#D946EF] to-[#0EA5E9] text-transparent bg-clip-text">Admin Panel</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${isActive(item.path) ? 'bg-gradient-to-r from-[#D946EF]/10 to-[#0EA5E9]/10 font-medium' : 'hover:bg-accent'}`}
                      onClick={() => {
                        toast({
                          title: `Navegando para ${item.title}`,
                          description: "Carregando página...",
                        });
                      }}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isActive(item.path) ? 'bg-gradient-to-r from-[#D946EF]/20 to-[#0EA5E9]/20' : 'bg-background group-hover:bg-primary/10'} transition-colors`}>
                        <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-primary' : 'group-hover:text-primary'} transition-colors`} />
                      </div>
                      {!isCollapsed && <span className={isActive(item.path) ? 'text-primary' : 'font-medium'}>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
