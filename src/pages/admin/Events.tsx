
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const EventsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Evento
        </Button>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <p className="text-muted-foreground">
            Nenhum evento cadastrado. Clique no botão acima para adicionar um novo evento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
