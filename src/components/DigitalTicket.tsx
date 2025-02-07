import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Barcode } from "lucide-react";

interface DigitalTicketProps {
  ticketId: string;
  securityCode: string;
  purchaseDate: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  location: string;
  area: string;
  buyerName: string;
  buyerCpf: string;
}

export const DigitalTicket = ({
  ticketId,
  securityCode,
  purchaseDate,
  eventTitle,
  eventDate,
  eventTime,
  location,
  area,
  buyerName,
  buyerCpf
}: DigitalTicketProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-white">
      <CardContent className="p-6 space-y-6">
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold">{eventTitle}</h2>
          <p className="text-muted-foreground">Ingresso Digital</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Data:</p>
            <p>{eventDate}</p>
          </div>
          <div>
            <p className="font-semibold">Hora:</p>
            <p>{eventTime}</p>
          </div>
          <div>
            <p className="font-semibold">Local:</p>
            <p>{location}</p>
          </div>
          <div>
            <p className="font-semibold">Área:</p>
            <p>{area}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Nome:</p>
              <p>{buyerName}</p>
            </div>
            <div>
              <p className="font-semibold">CPF:</p>
              <p>{buyerCpf}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">ID do Ingresso:</p>
              <p>{ticketId}</p>
            </div>
            <div>
              <p className="font-semibold">Código de Segurança:</p>
              <p>{securityCode}</p>
            </div>
            <div>
              <p className="font-semibold">Data da Compra:</p>
              <p>{purchaseDate}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 pt-4">
          <div className="text-center">
            <QrCode className="w-32 h-32 mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">QR Code</p>
          </div>
          <div className="text-center">
            <Barcode className="w-32 h-32 mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">Código de Barras</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};