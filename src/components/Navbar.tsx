
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Ticket, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
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
            <Input
              type="search"
              placeholder="Buscar eventos..."
              className="w-full pl-10 bg-background border-muted"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/events" className="text-sm font-medium hover:text-primary transition-colors">
            Eventos
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Minha Conta</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Sair
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link to="/login">Login</Link>
                </DropdownMenuItem>
              )}
              {!isLoggedIn && (
                <DropdownMenuItem asChild>
                  <Link to="/admin">Painel Admin</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="md:hidden container mx-auto px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar eventos..."
            className="w-full pl-10 bg-background border-muted"
          />
        </div>
      </div>
    </nav>
  );
};
