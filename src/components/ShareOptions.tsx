
import { Mail, Download, Share2, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface ShareOptionsProps {
  data?: any[];
  title?: string;
}

export const ShareOptions = ({ data = [], title = 'Relatório' }: ShareOptionsProps) => {
  const { toast } = useToast();

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

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Adiciona o título
      doc.setFontSize(16);
      doc.text(title, 20, 20);
      
      // Adiciona os dados
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]);
        
        // Configura as colunas
        let yPosition = 40;
        const margin = 20;
        
        // Adiciona cabeçalho
        doc.setFontSize(12);
        doc.text(headers.join(' | '), margin, yPosition);
        
        // Adiciona linhas de dados
        data.forEach((row, index) => {
          yPosition += 10;
          const rowData = headers.map(header => String(row[header]));
          doc.text(rowData.join(' | '), margin, yPosition);
        });
      }
      
      // Salva o PDF
      doc.save(`${title}.pdf`);
      
      toast({
        title: "Download concluído",
        description: "PDF baixado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível gerar o arquivo PDF",
        variant: "destructive",
      });
    }
  };

  const handleDownloadExcel = () => {
    try {
      if (data && data.length > 0) {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dados");
        XLSX.writeFile(wb, `${title}.xlsx`);
        
        toast({
          title: "Download concluído",
          description: "Excel baixado com sucesso",
        });
      } else {
        throw new Error("Sem dados para exportar");
      }
    } catch (error) {
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível gerar o arquivo Excel",
        variant: "destructive",
      });
    }
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
        <DropdownMenuItem onClick={handleDownloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Baixar PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadExcel}>
          <Download className="mr-2 h-4 w-4" />
          Baixar Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
