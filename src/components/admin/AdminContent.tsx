
import { Routes, Route } from "react-router-dom";
import DashboardPage from "@/pages/admin/Dashboard";
import EventsPage from "@/pages/admin/Events";
import CustomersPage from "@/pages/admin/Customers";
import SalesPage from "@/pages/admin/Sales";
import ReportsPage from "@/pages/admin/Reports";
import ChatPage from "@/pages/admin/Chat";
import SettingsPage from "@/pages/admin/Settings";
import BannerPage from "@/pages/admin/Banner";
import ApiConnectPage from "@/pages/admin/ApiConnect";
import TokensApiPage from "@/pages/admin/TokensApi";
import TicketsApiPage from "@/pages/admin/TicketsApi";
import SoldTicketsPage from "@/pages/admin/SoldTickets";
import KanbanPage from "@/pages/admin/Kanban";

interface AdminContentProps {
  isCollapsed: boolean;
}

export const AdminContent = ({ isCollapsed }: AdminContentProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/sold-tickets" element={<SoldTicketsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/banner" element={<BannerPage />} />
          <Route path="/api-connect" element={<ApiConnectPage />} />
          <Route path="/tickets-api" element={<TicketsApiPage />} />
          <Route path="/tokens-api" element={<TokensApiPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
};
