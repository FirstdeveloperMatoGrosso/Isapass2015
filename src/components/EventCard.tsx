
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Tag, Music } from "lucide-react";
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
  classification: string;
  areas: string[];
  attractions: string[];
}

export const EventCard = ({ 
  id, 
  title, 
  date, 
  location, 
  imageUrl, 
  price,
  classification,
  areas,
  attractions
}: EventCardProps) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/events/${id}/buy`);
  };

  // Extrair o dia e mês da data para exibição no formato do design
  const formatDateParts = () => {
    try {
      const dateParts = date.split(' ');
      if (dateParts.length >= 2) {
        const day = dateParts[0];
        const month = dateParts[1].substring(0, 3).toUpperCase();
        return { day, month };
      }
      return { day: date, month: "" };
    } catch (error) {
      return { day: date, month: "" };
    }
  };

  const { day, month } = formatDateParts();

  return (
    <>
      <Card className="event-card cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={() => setShowDetails(true)}>
        <CardContent className="p-0">
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-2 left-2 bg-white rounded-lg shadow-md p-1 flex flex-col items-center justify-center min-w-14 text-center">
              <span className="text-[#e91e63] text-xl font-bold leading-tight">{day}</span>
              <span className="text-[#e91e63] text-xs font-medium leading-tight">{month}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4 gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="w-full flex items-center justify-between mt-2">
            <span className="font-semibold">R$ {price.toFixed(2)}</span>
            <Button size="sm" className="bg-[#e91e63] hover:bg-[#d81b60]" onClick={handleBuyClick}>Comprar</Button>
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
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>Classificação: {classification}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">Áreas disponíveis:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {areas.map((area) => (
                    <span key={area} className="px-2 py-1 bg-muted rounded-full text-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">Atrações:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {attractions.map((attraction) => (
                    <span key={attraction} className="px-2 py-1 bg-muted rounded-full text-sm">
                      {attraction}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Preço por ingresso</p>
                  <p className="text-2xl font-bold">R$ {price.toFixed(2)}</p>
                </div>
                <Button onClick={handleBuyClick} className="bg-[#e91e63] hover:bg-[#d81b60]">
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
