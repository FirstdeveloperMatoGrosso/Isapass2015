
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
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const addHeader = (doc: jsPDF) => {
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(COMPANY_INFO.name, 20, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Email: ${COMPANY_INFO.email}`, 20, 30);
    doc.text(`Telefone: ${COMPANY_INFO.phone}`, 20, 35);
    doc.text(`Website: ${COMPANY_INFO.website}`, 20, 40);

    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    return 55;
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      const startY = addHeader(doc);
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, startY);
      
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]);
        let yPosition = startY + 20;
        const margin = 20;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(headers.join(' | '), margin, yPosition);
        
        data.forEach((row) => {
          yPosition += 10;
          const rowData = headers.map(header => String(row[header]));
          doc.text(rowData.join(' | '), margin, yPosition);
        });
      }
      
      doc.save(`${title}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  const handleDownloadExcel = () => {
    try {
      if (data && data.length > 0) {
        const wb = XLSX.utils.book_new();
        
        const headerData = [
          [COMPANY_INFO.name],
          [`Email: ${COMPANY_INFO.email}`],
          [`Telefone: ${COMPANY_INFO.phone}`],
          [`Website: ${COMPANY_INFO.website}`],
          [], 
          [title],
          [], 
        ];
        
        const ws = XLSX.utils.json_to_sheet(data);
        
        XLSX.utils.sheet_add_aoa(ws, headerData, { origin: 'A1' });
        
        const maxWidth = Math.max(...headerData.map(row => row[0]?.length || 0));
        ws['!cols'] = [{ wch: maxWidth }];
        
        XLSX.utils.book_append_sheet(wb, ws, "Dados");
        
        XLSX.writeFile(wb, `${title}.xlsx`);
      }
    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
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
