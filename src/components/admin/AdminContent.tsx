
import { Routes, Route } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardPage from "@/pages/admin/Dashboard";
import EventsPage from "@/pages/admin/Events";
import CustomersPage from "@/pages/admin/Customers";
import SalesPage from "@/pages/admin/Sales";
import ReportsPage from "@/pages/admin/Reports";
import ChatPage from "@/pages/admin/Chat";
import SettingsPage from "@/pages/admin/Settings";
import BannersPage from "@/pages/admin/Banners";
import ApiConnectPage from "@/pages/admin/ApiConnect";

interface AdminContentProps {
  isCollapsed: boolean;
}

export const AdminContent = ({ isCollapsed }: AdminContentProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Overlay para dispositivos móveis */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          aria-hidden="true"
          onClick={() => document.dispatchEvent(new CustomEvent('toggle-sidebar'))}
        />
      )}
      <div className="w-full">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/banners" element={<BannersPage />} />
          <Route path="/api-connect" element={<ApiConnectPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
};
