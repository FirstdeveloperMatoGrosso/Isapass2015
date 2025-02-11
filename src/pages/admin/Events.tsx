
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: number;
  capacity: number;
  imageUrl: string;
  classification: string;
  areas: string[];
  attractions: string[];
}

const EventsPage = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Festival de Verão",
      date: "2024-03-15",
      time: "16:00",
      location: "Praia de Copacabana",
      description: "O maior festival de música do verão",
      price: 150.00,
      capacity: 10000,
      imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
      classification: "16 anos",
      areas: ["Pista", "Área VIP", "Camarote"],
      attractions: ["Ivete Sangalo", "Anitta", "Jorge & Mateus"]
    }
  ]);
  
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    price: "",
    capacity: "",
    imageUrl: "",
    classification: "",
    areas: "",
    attractions: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      description: formData.description,
      price: Number(formData.price),
      capacity: Number(formData.capacity),
      imageUrl: formData.imageUrl,
      classification: formData.classification,
      areas: formData.areas.split(',').map(area => area.trim()),
      attractions: formData.attractions.split(',').map(attraction => attraction.trim())
    };

    setEvents(prev => [...prev, newEvent]);
    toast({
      title: "Evento criado com sucesso!",
      description: `O evento ${formData.title} foi cadastrado.`,
    });
    setIsCreating(false);
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      price: "",
      capacity: "",
      imageUrl: "",
      classification: "",
      areas: "",
      attractions: ""
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Eventos</h2>
          <p className="text-muted-foreground">
            Gerencie seus eventos e programações
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreating(true)} className="hover-scale">
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isCreating ? (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Criar Novo Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Nome do Evento</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classification">Classificação</Label>
                  <Input
                    id="classification"
                    name="classification"
                    value={formData.classification}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: 16 anos"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL da Imagem</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    required
                    placeholder="https://..."
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacidade</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="areas">Áreas (separadas por vírgula)</Label>
                <Input
                  id="areas"
                  name="areas"
                  value={formData.areas}
                  onChange={handleInputChange}
                  required
                  placeholder="Pista, VIP, Camarote"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attractions">Atrações (separadas por vírgula)</Label>
                <Input
                  id="attractions"
                  name="attractions"
                  value={formData.attractions}
                  onChange={handleInputChange}
                  required
                  placeholder="Artista 1, Artista 2, Banda 3"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreating(false)}
                  className="hover:bg-secondary/80 transition-colors"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="hover-scale"
                >
                  Criar Evento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((event) => (
              <Card key={event.id} className="hover-scale transition-all duration-300 hover:shadow-lg">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button size="icon" variant="secondary" className="w-8 h-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="w-8 h-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Data: {new Date(event.date).toLocaleDateString('pt-BR')}</p>
                    <p>Horário: {event.time}</p>
                    <p>Local: {event.location}</p>
                    <p>Preço: R$ {event.price.toFixed(2)}</p>
                    <p>Classificação: {event.classification}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Áreas:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.areas.map((area) => (
                        <span key={area} className="px-2 py-1 bg-secondary/20 rounded-full text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 text-center">
                <p className="text-muted-foreground">
                  Nenhum evento cadastrado. Clique no botão acima para adicionar um novo evento.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
