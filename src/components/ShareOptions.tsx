
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
  const handleShare = (method: string) => {
    toast({
      title: "Compartilhando",
      description: `Compartilhando via ${method}...`,
    });
  };

  const handleDownload = (format: string) => {
    toast({
      title: "Download iniciado",
      description: `Baixando relatório em ${format}...`,
    });
  };

  return (
    <div className="fixed top-20 right-4 z-40">
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
    </div>
  );
};
