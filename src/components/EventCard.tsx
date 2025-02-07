
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  price: number;
}

export const EventCard = ({ id, title, date, location, imageUrl, price }: EventCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Previne a navegação do Link
    // Aqui você pode adicionar a lógica para verificar se o usuário está logado
    // Por enquanto, vamos simular que o usuário não está logado
    const isLoggedIn = false;

    if (!isLoggedIn) {
      toast({
        title: "Acesso Restrito",
        description: "Você precisa estar logado para comprar ingressos. Faça login ou cadastre-se.",
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        ),
      });
      return;
    }

    // Se estiver logado, navegue para a página de compra
    navigate(`/events/${id}/buy`);
  };

  return (
    <Link to={`/events/${id}`}>
      <Card className="event-card">
        <CardContent className="p-0">
          <div className="relative h-48 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg">{title}</h3>
            </div>
          </div>
        </CardContent>
        <CardFooter className="grid gap-2 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold">R$ {price.toFixed(2)}</span>
            <Button size="sm" onClick={handleBuyClick}>Comprar</Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
