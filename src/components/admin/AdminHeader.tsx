
import { Users } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const AdminHeader = () => {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-6 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="md:hidden">
        <SidebarTrigger className="inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10" />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D946EF]/20 to-[#0EA5E9]/20 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium bg-gradient-to-r from-[#D946EF] to-[#0EA5E9] text-transparent bg-clip-text hidden sm:inline-block">
            Bem-vindo(a), Admin
          </span>
        </div>
      </div>
    </div>
  );
};
