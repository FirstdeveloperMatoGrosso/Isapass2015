import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Ticket, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginDialog } from "./LoginDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
export const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showAdminLoginDialog, setShowAdminLoginDialog] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    // Verificar se o usuário está logado
    const checkUser = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setUserId(session.user.id);
      }
    };
    checkUser();

    // Configurar o listener para mudanças de autenticação
    const {
      data: authListener
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        setUserId(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserId(null);
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUserId(null);
      toast.success("Logout realizado com sucesso!");
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };
  return <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold shrink-0">
              <Ticket className="h-8 w-8 text-[#0EA5E9]" />
              <div className="flex">
                <span className="text-[#D946EF]">Isa</span>
                <span className="text-[#0EA5E9]">Pass</span>
              </div>
            </Link>
            
            <div className="relative flex-1 max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar eventos..." className="w-full pl-10 bg-background border-muted" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isLoggedIn ? <>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Minha Conta</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Sair
                    </DropdownMenuItem>
                  </> : <DropdownMenuItem onClick={() => setShowLoginDialog(true)}>
                    Login
                  </DropdownMenuItem>}
                {!isLoggedIn && <DropdownMenuItem onClick={() => setShowAdminLoginDialog(true)}>
                    Painel Admin
                  </DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="md:hidden container mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar eventos..." className="w-full pl-10 bg-background border-muted" />
          </div>
        </div>
      </nav>

      {/* Diálogo de Login */}
      <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} isAdmin={false} />

      {/* Diálogo de Login Admin */}
      <LoginDialog isOpen={showAdminLoginDialog} onClose={() => setShowAdminLoginDialog(false)} isAdmin={true} />
    </>;
};