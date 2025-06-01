import { Card, CardContent } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";

interface TicketTemplateProps {
  event: {
    name: string;
    type: string;
    date: string;
    time: string;
    location: string;
    area: string;
  };
  customer: {
    name: string;
    email: string;
    cpf?: string;
    phone?: string;
  };
  ticket: {
    id: string;
    code: string;
    purchaseDate: string;
  };
}

export const TicketTemplate = ({ event, customer, ticket }: TicketTemplateProps) => {
  return (
    <Card className="w-full max-w-[300px] mx-auto bg-white text-black">
      <CardContent className="p-6 space-y-4">
        {/* Cabeçalho do Ingresso */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">{event.name}</h2>
          <p className="text-sm text-gray-600">{event.type}</p>
        </div>

        {/* Informações do Evento */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-semibold">Data:</span>
            <span className="text-sm">{event.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-semibold">Hora:</span>
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-semibold">Local:</span>
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-semibold">Área:</span>
            <span className="text-sm">{event.area}</span>
          </div>
        </div>

        {/* Informações do Cliente */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-semibold">Nome:</span>
            <span className="text-sm">{customer.email}</span>
          </div>
          {customer.cpf && (
            <div className="flex justify-between">
              <span className="text-sm font-semibold">CPF:</span>
              <span className="text-sm">{customer.cpf}</span>
            </div>
          )}
          {customer.phone && (
            <div className="flex justify-between">
              <span className="text-sm font-semibold">Tel:</span>
              <span className="text-sm">{customer.phone}</span>
            </div>
          )}
        </div>

        {/* Informações do Ingresso */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-semibold">ID:</span>
            <span className="text-sm">{ticket.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-semibold">Código:</span>
            <span className="text-sm">{ticket.code}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-semibold">Compra:</span>
            <span className="text-sm">{ticket.purchaseDate}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center py-4">
          <QRCodeSVG value={ticket.code} size={150} />
        </div>

        {/* Código de Barras */}
        <div className="flex justify-center">
          <Barcode value={ticket.code} width={1.5} height={50} fontSize={12} />
        </div>

        {/* Aviso */}
        <p className="text-xs text-gray-500 text-center italic">
          Este ingresso é pessoal e intransferível. Apresente este QR Code na entrada do evento.
        </p>
      </CardContent>
    </Card>
  );
};
