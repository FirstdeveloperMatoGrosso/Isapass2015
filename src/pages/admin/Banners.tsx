
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
}

const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [newBanner, setNewBanner] = useState<Partial<Banner>>({});

  const handleAddBanner = () => {
    if (!newBanner.title || !newBanner.imageUrl) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const banner: Banner = {
      id: Date.now().toString(),
      title: newBanner.title,
      imageUrl: newBanner.imageUrl,
      link: newBanner.link || '#'
    };

    setBanners([...banners, banner]);
    setNewBanner({});
    toast({
      title: "Sucesso",
      description: "Banner adicionado com sucesso!"
    });
  };

  const handleDeleteBanner = (id: string) => {
    setBanners(banners.filter(banner => banner.id !== id));
    toast({
      title: "Sucesso",
      description: "Banner removido com sucesso!"
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Gerenciar Banners</h2>
        <p className="text-muted-foreground">
          Adicione e gerencie os banners que aparecem na página inicial
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newBanner.title || ''}
                onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                placeholder="Digite o título do banner"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                value={newBanner.imageUrl || ''}
                onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                placeholder="Cole a URL da imagem"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link">Link (opcional)</Label>
              <Input
                id="link"
                value={newBanner.link || ''}
                onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                placeholder="Digite o link do banner"
              />
            </div>
            <Button onClick={handleAddBanner} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Banner
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardContent className="p-4">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{banner.title}</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteBanner(banner.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BannersPage;
