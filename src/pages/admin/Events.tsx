
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ShareOptions } from "@/components/ShareOptions";

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

interface FormData {
  id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: string;
  capacity: string;
  imageUrl: string;
  classification: string;
  areas: string;
  attractions: string;
}

const EventsPage = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
  
  const [formData, setFormData] = useState<FormData>({
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

  const handleEdit = (event: Event) => {
    setFormData({
      id: event.id, // Agora incluímos o id ao editar
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      price: event.price.toString(),
      capacity: event.capacity.toString(),
      imageUrl: event.imageUrl,
      classification: event.classification,
      areas: event.areas.join(', '),
      attractions: event.attractions.join(', ')
    });
    setIsEditing(true);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    toast({
      title: "Evento excluído",
      description: "O evento foi removido com sucesso.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: isEditing && formData.id ? formData.id : Math.random().toString(36).substr(2, 9),
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

    if (isEditing) {
      setEvents(prev => prev.map(event => event.id === newEvent.id ? newEvent : event));
      toast({
        title: "Evento atualizado!",
        description: `O evento ${formData.title} foi atualizado com sucesso.`,
      });
    } else {
      setEvents(prev => [...prev, newEvent]);
      toast({
        title: "Evento criado com sucesso!",
        description: `O evento ${formData.title} foi cadastrado.`,
      });
    }
    
    setIsCreating(false);
    setIsEditing(false);
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
          <ShareOptions />
          <Button onClick={() => setIsCreating(true)} className="hover-scale">
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Button>
        </div>
      </div>
      
      {isCreating ? (
        <Card className="w-full max-w-4xl mx-auto hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {isEditing ? "Editar Evento" : "Novo Evento"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-muted-foreground">Título do Evento</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-muted-foreground">Data</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium text-muted-foreground">Horário</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-muted-foreground">Local</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-muted-foreground">Preço</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-sm font-medium text-muted-foreground">Capacidade</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classification" className="text-sm font-medium text-muted-foreground">Classificação Etária</Label>
                  <Input
                    id="classification"
                    name="classification"
                    value={formData.classification}
                    onChange={handleInputChange}
                    className="bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="text-sm font-medium text-muted-foreground">URL da Imagem</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="min-h-[100px] bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="areas" className="text-sm font-medium text-muted-foreground">Áreas (separadas por vírgula)</Label>
                  <Input
                    id="areas"
                    name="areas"
                    value={formData.areas}
                    onChange={handleInputChange}
                    placeholder="Ex: Pista, VIP, Camarote"
                    className="bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="attractions" className="text-sm font-medium text-muted-foreground">Atrações (separadas por vírgula)</Label>
                  <Input
                    id="attractions"
                    name="attractions"
                    value={formData.attractions}
                    onChange={handleInputChange}
                    placeholder="Ex: Artista 1, Banda 2"
                    className="bg-background/50"
                    required
                  />
                </div>

              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
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
                  }}
                  type="button"
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary/90 hover:bg-primary transition-colors"
                >
                  {isEditing ? "Salvar Alterações" : "Criar Evento"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {events.length > 0 ? (
            events.map((event) => (
              <Card key={event.id} className="group hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="w-8 h-8"
                      onClick={() => handleEdit(event)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="w-8 h-8"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">{event.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Data:</span>
                      {new Date(event.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Horário:</span>
                      {event.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Local:</span>
                      {event.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Preço:</span>
                      R$ {event.price.toFixed(2)}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Classificação:</span>
                      {event.classification}
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2 text-primary/80">Áreas:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.areas.map((area) => (
                        <span 
                          key={area} 
                          className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors"
                        >
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
