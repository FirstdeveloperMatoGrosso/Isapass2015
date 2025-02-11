
import { Mail, Download, Share2, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

export const ShareOptions = () => {
  const handleShare = async (method: string) => {
    try {
      if (navigator.share && (method === 'WhatsApp' || method === 'Telegram')) {
        await navigator.share({
          title: 'Compartilhar conteúdo',
          text: 'Confira este conteúdo interessante!',
          url: window.location.href,
        });
      } else if (method === 'Email') {
        const subject = encodeURIComponent('Compartilhar conteúdo');
        const body = encodeURIComponent(`Confira este conteúdo: ${window.location.href}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      }
      
      toast({
        title: "Compartilhado com sucesso!",
        description: `Conteúdo compartilhado via ${method}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível compartilhar o conteúdo",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (format: string) => {
    toast({
      title: "Download iniciado",
      description: `Baixando relatório em ${format}...`,
    });
    // Aqui você pode implementar a lógica real de download
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleShare('WhatsApp')}>
          <MessageSquare className="mr-2 h-4 w-4" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('Telegram')}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('Email')}>
          <Mail className="mr-2 h-4 w-4" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('PDF')}>
          <Download className="mr-2 h-4 w-4" />
          Baixar PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('Excel')}>
          <Download className="mr-2 h-4 w-4" />
          Baixar Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
