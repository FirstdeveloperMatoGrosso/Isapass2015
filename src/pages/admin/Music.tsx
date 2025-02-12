
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Plus, Pencil, Trash2, Ban } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Music {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  isBlocked: boolean;
}

const MusicPage = () => {
  const [musics, setMusics] = useState<Music[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<Music | null>(null);
  const { toast } = useToast();

  const handleAddMusic = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const newMusic: Music = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      artist: formData.get('artist') as string,
      duration: Number(formData.get('duration')),
      url: formData.get('url') as string,
      isBlocked: false
    };

    setMusics([...musics, newMusic]);
    toast({
      title: "Música adicionada",
      description: "A música foi adicionada com sucesso à playlist.",
    });
  };

  const handleEdit = (music: Music) => {
    setCurrentEdit(music);
  };

  const handleDelete = (id: string) => {
    setMusics(musics.filter(music => music.id !== id));
    toast({
      title: "Música removida",
      description: "A música foi removida com sucesso da playlist.",
    });
  };

  const handleToggleBlock = (id: string) => {
    setMusics(musics.map(music => 
      music.id === id ? { ...music, isBlocked: !music.isBlocked } : music
    ));
    toast({
      title: "Status atualizado",
      description: "O status da música foi atualizado com sucesso.",
    });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciador de Músicas</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-4">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Música
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Música</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddMusic} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="artist">Artista</Label>
                  <Input id="artist" name="artist" required />
                </div>
                <div>
                  <Label htmlFor="duration">Duração (segundos)</Label>
                  <Input id="duration" name="duration" type="number" required />
                </div>
                <div>
                  <Label htmlFor="url">URL da Música</Label>
                  <Input id="url" name="url" required />
                </div>
                <Button type="submit">Salvar</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Artista</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {musics.map((music) => (
                <TableRow key={music.id}>
                  <TableCell>{music.title}</TableCell>
                  <TableCell>{music.artist}</TableCell>
                  <TableCell>{music.duration}s</TableCell>
                  <TableCell>
                    {music.isBlocked ? "Bloqueada" : "Ativa"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(music)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(music.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleToggleBlock(music.id)}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicPage;
