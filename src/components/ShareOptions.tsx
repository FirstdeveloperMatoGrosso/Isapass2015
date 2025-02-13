
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

// Configurações da empresa
const COMPANY_INFO = {
  name: 'IsaPass',
  email: 'contato@isapass.com',
  phone: '(11) 99999-9999',
  website: 'www.isapass.com',
};

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

  const addHeader = (doc: jsPDF) => {
    // Logo (substituído por texto até ter uma imagem)
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY_INFO.name, 20, 20);

    // Informações de contato
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Email: ${COMPANY_INFO.email}`, 20, 30);
    doc.text(`Telefone: ${COMPANY_INFO.phone}`, 20, 35);
    doc.text(`Website: ${COMPANY_INFO.website}`, 20, 40);

    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    return 55; // Retorna a posição Y após o cabeçalho
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      const startY = addHeader(doc);
      
      // Adiciona o título
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, startY);
      
      // Adiciona os dados
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]);
        
        // Configura as colunas
        let yPosition = startY + 20;
        const margin = 20;
        
        // Adiciona cabeçalho da tabela
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(headers.join(' | '), margin, yPosition);
        
        // Adiciona linhas de dados
        data.forEach((row) => {
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
        // Cria uma nova planilha
        const wb = XLSX.utils.book_new();
        
        // Adiciona as informações da empresa no topo
        const headerData = [
          [COMPANY_INFO.name],
          [`Email: ${COMPANY_INFO.email}`],
          [`Telefone: ${COMPANY_INFO.phone}`],
          [`Website: ${COMPANY_INFO.website}`],
          [], // Linha em branco para separação
          [title],
          [], // Linha em branco para separação
        ];
        
        // Converte os dados para o formato do Excel
        const ws = XLSX.utils.json_to_sheet(data);
        
        // Adiciona o cabeçalho antes dos dados
        XLSX.utils.sheet_add_aoa(ws, headerData, { origin: 'A1' });
        
        // Ajusta a largura das colunas
        const maxWidth = Math.max(...headerData.map(row => row[0]?.length || 0));
        ws['!cols'] = [{ wch: maxWidth }];
        
        // Adiciona a planilha ao workbook
        XLSX.utils.book_append_sheet(wb, ws, "Dados");
        
        // Salva o arquivo
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
