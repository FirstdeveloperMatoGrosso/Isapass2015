
import { Routes, Route } from "react-router-dom";
import { ShareOptions } from "@/components/ShareOptions";
import DashboardPage from "@/pages/admin/Dashboard";
import EventsPage from "@/pages/admin/Events";
import CustomersPage from "@/pages/admin/Customers";
import SalesPage from "@/pages/admin/Sales";
import ReportsPage from "@/pages/admin/Reports";
import ChatPage from "@/pages/admin/Chat";
import SettingsPage from "@/pages/admin/Settings";
import BannersPage from "@/pages/admin/Banners";

interface AdminContentProps {
  isCollapsed: boolean;
}

export const AdminContent = ({ isCollapsed }: AdminContentProps) => {
  return (
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
  );
};
