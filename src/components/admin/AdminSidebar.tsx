
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { BarChart3, Calendar, CreditCard, LayoutDashboard, MessageSquare, Settings, Users, ChevronLeft, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const AdminSidebar = ({ isCollapsed, setIsCollapsed }: AdminSidebarProps) => {
  const { toast } = useToast();
  
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

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    toast({
      title: isCollapsed ? "Menu expandido" : "Menu recolhido",
      duration: 1500,
    });
  };

  return (
    <Sidebar className={`hidden md:flex h-screen flex-col fixed left-0 top-0 z-20 border-r bg-card transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <SidebarContent>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={handleCollapse}
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
  );
};
