
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { BarChart3, Calendar, CreditCard, LayoutDashboard, MessageSquare, Settings, Users, ChevronLeft, ImageIcon, Link2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const AdminSidebar = ({ isCollapsed, setIsCollapsed }: AdminSidebarProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { title: "Eventos", icon: Calendar, path: "/admin/events" },
    { title: "Clientes", icon: Users, path: "/admin/customers" },
    { title: "Vendas", icon: CreditCard, path: "/admin/sales" },
    { title: "Relatórios", icon: BarChart3, path: "/admin/reports" },
    { title: "Chat Bot", icon: MessageSquare, path: "/admin/chat" },
    { title: "Banners", icon: ImageIcon, path: "/admin/banners" },
    { title: "API Connect", icon: Link2, path: "/admin/api-connect" },
    { title: "Configurações", icon: Settings, path: "/admin/settings" },
  ];

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    toast({
      title: isCollapsed ? "Menu expandido" : "Menu recolhido",
      duration: 1500,
    });
  };

  const handleMobileMenuClick = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  if (!isMobile && isCollapsed) {
    return (
      <Sidebar className="fixed h-screen transition-all duration-300 border-r bg-card w-16 z-50">
        <SidebarContent>
          <div className="pt-4 px-3">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent w-full"
              onClick={handleCollapse}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          <SidebarGroup>
            <SidebarGroupContent className="mt-4">
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.path} 
                        className="flex items-center justify-center p-2 rounded-lg hover:bg-accent transition-all duration-200"
                        title={item.title}
                      >
                        <item.icon className="h-5 w-5" />
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
  }

  return (
    <>
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleMobileMenuClick}
        />
      )}
      <Sidebar 
        className={`fixed h-screen transition-all duration-300 border-r bg-card z-50 ${
          isMobile ? 'w-[85vw] max-w-[300px]' : 'w-64'
        } ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}`}
      >
        <SidebarContent className="flex flex-col h-full">
          <div className="pt-4 px-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <LayoutDashboard className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent"
              onClick={handleCollapse}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <SidebarGroup>
            <SidebarGroupContent className="mt-4">
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.path} 
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-all duration-200 group"
                        onClick={() => {
                          toast({
                            title: `Navegando para ${item.title}`,
                            description: "Carregando página...",
                          });
                          handleMobileMenuClick();
                        }}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background group-hover:bg-primary/10 transition-colors">
                          <item.icon className="h-5 w-5 group-hover:text-primary transition-colors" />
                        </div>
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
    </>
  );
};
