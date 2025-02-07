
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

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
  const [showDetails, setShowDetails] = useState(false);

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Previne a navegação do Link
    e.stopPropagation(); // Previne que o modal abra
    navigate(`/events/${id}/buy`);
  };

  return (
    <>
      <Card className="event-card cursor-pointer" onClick={() => setShowDetails(true)}>
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

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{location}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Preço por ingresso</p>
                  <p className="text-2xl font-bold">R$ {price.toFixed(2)}</p>
                </div>
                <Button onClick={handleBuyClick}>
                  Comprar Ingresso
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
