import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, MoveUp, MoveDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ShareOptions } from "@/components/ShareOptions";

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  order: number;
  active: boolean;
}

interface FormData {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  active: boolean;
}

const BannerPage = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: "1",
      title: "Festival de Verão",
      description: "O maior festival de música do verão",
      imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
      link: "/events/festival-de-verao",
      order: 1,
      active: true
    }
  ]);
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    imageUrl: "",
    link: "",
    active: true
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleEdit = (banner: Banner) => {
    setFormData({
      id: banner.id,
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      link: banner.link,
      active: banner.active
    });
    setIsEditing(true);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
    toast({
      title: "Banner excluído",
      description: "O banner foi removido com sucesso.",
    });
  };

  const handleMoveUp = (id: string) => {
    setBanners(prev => {
      const index = prev.findIndex(banner => banner.id === id);
      if (index > 0) {
        const newBanners = [...prev];
        [newBanners[index - 1], newBanners[index]] = [newBanners[index], newBanners[index - 1]];
        return newBanners.map((banner, idx) => ({ ...banner, order: idx + 1 }));
      }
      return prev;
    });
  };

  const handleMoveDown = (id: string) => {
    setBanners(prev => {
      const index = prev.findIndex(banner => banner.id === id);
      if (index < prev.length - 1) {
        const newBanners = [...prev];
        [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
        return newBanners.map((banner, idx) => ({ ...banner, order: idx + 1 }));
      }
      return prev;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBanner: Banner = {
      id: isEditing && formData.id ? formData.id : Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      link: formData.link,
      active: formData.active,
      order: isEditing ? banners.find(b => b.id === formData.id)?.order || banners.length + 1 : banners.length + 1
    };

    if (isEditing) {
      setBanners(prev => prev.map(banner => banner.id === newBanner.id ? newBanner : banner));
      toast({
        title: "Banner atualizado!",
        description: `O banner ${formData.title} foi atualizado com sucesso.`,
      });
    } else {
      setBanners(prev => [...prev, newBanner]);
      toast({
        title: "Banner criado com sucesso!",
        description: `O banner ${formData.title} foi cadastrado.`,
      });
    }
    
    setIsCreating(false);
    setIsEditing(false);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      link: "",
      active: true
    });
  };

  return (
    <div className="p-8 bg-gradient-to-b from-background to-background/80 min-h-screen">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Banners
            </h2>
            <p className="text-muted-foreground">
              Gerencie os banners que aparecem na página inicial.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ShareOptions />
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-primary/90 hover:bg-primary transition-colors"
              disabled={isCreating}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Banner
            </Button>
          </div>
        </div>

        {isCreating ? (
          <Card className="w-full max-w-4xl mx-auto hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {isEditing ? "Editar Banner" : "Novo Banner"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-muted-foreground">
                      Título do Banner
                    </Label>
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
                    <Label htmlFor="imageUrl" className="text-sm font-medium text-muted-foreground">
                      URL da Imagem
                    </Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="link" className="text-sm font-medium text-muted-foreground">
                      Link do Banner
                    </Label>
                    <Input
                      id="link"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      className="bg-background/50"
                      required
                    />
                  </div>

                  <div className="space-y-2 flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 rounded border-primary/20 text-primary bg-background/50"
                      />
                      <span className="text-sm font-medium text-muted-foreground">
                        Banner Ativo
                      </span>
                    </label>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">
                      Descrição
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[100px] bg-background/50"
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
                        description: "",
                        imageUrl: "",
                        link: "",
                        active: true
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
                    {isEditing ? "Salvar Alterações" : "Criar Banner"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {banners.length > 0 ? (
              banners.map((banner) => (
                <Card key={banner.id} className="group hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-primary/10 hover:border-primary/20 backdrop-blur bg-background/60">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="w-8 h-8"
                        onClick={() => handleEdit(banner)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="w-8 h-8"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                      {banner.title}
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="line-clamp-2">{banner.description}</p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          banner.active 
                            ? "bg-primary/10 text-primary" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {banner.active ? "Ativo" : "Inativo"}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Ordem:</span>
                        {banner.order}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-8 h-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleMoveUp(banner.id)}
                        disabled={banner.order === 1}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-8 h-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleMoveDown(banner.id)}
                        disabled={banner.order === banners.length}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Nenhum banner cadastrado. Clique no botão acima para adicionar um novo banner.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerPage;
