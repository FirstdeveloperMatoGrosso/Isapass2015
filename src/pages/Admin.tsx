import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminContent } from "@/components/admin/AdminContent";
import { LayoutDashboard, FileText, MessageSquare, Settings, Trello } from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background">
        <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <AdminHeader />
          <AdminContent isCollapsed={isCollapsed} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
