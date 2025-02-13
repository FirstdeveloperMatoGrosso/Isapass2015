
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminContent } from "@/components/admin/AdminContent";

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Só redireciona para /admin/dashboard se estiver exatamente em /admin
    if (location.pathname === '/admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate, location]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className="flex-1 flex flex-col min-h-screen">
          <AdminHeader />
          <AdminContent isCollapsed={isCollapsed} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
