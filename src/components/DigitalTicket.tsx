
import { Card, CardContent } from "@/components/ui/card";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  buyerPhone?: string;
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
  buyerCpf,
  buyerPhone
}: DigitalTicketProps) => {
  const ticketData = {
    ticketId,
    securityCode,
    buyerName,
    buyerCpf,
    buyerPhone,
    eventTitle,
    eventDate,
    eventTime
  };

  const qrCodeValue = JSON.stringify(ticketData);
  const barcodeValue = `${ticketId}-${securityCode}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="w-[204px] mx-auto bg-white hover:bg-gray-50 cursor-pointer transition-colors">
          <CardContent className="p-2 space-y-2">
            <div className="text-center border-b pb-2">
              <h2 className="text-base font-bold">{eventTitle}</h2>
              <p className="text-xs text-muted-foreground">Ingresso Digital</p>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-semibold">Data:</span>
                <span>{eventDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Hora:</span>
                <span>{eventTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Local:</span>
                <span>{location}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Área:</span>
                <span>{area}</span>
              </div>
            </div>

            <div className="border-t pt-2 space-y-1 text-xs">
              <div>
                <span className="font-semibold">Nome: </span>
                <span>{buyerName}</span>
              </div>
              <div>
                <span className="font-semibold">CPF: </span>
                <span>{buyerCpf}</span>
              </div>
              <div>
                <span className="font-semibold">Tel: </span>
                <span>{buyerPhone || "Não informado"}</span>
              </div>
            </div>

            <div className="border-t pt-2 space-y-1 text-xs">
              <div>
                <span className="font-semibold">ID: </span>
                <span>{ticketId}</span>
              </div>
              <div>
                <span className="font-semibold">Código: </span>
                <span>{securityCode}</span>
              </div>
              <div>
                <span className="font-semibold">Compra: </span>
                <span>{purchaseDate}</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 pt-2">
              <div className="text-center">
                <QRCodeSVG 
                  value={qrCodeValue}
                  size={180}
                  level="H"
                  className="mx-auto"
                />
                <p className="text-xs text-muted-foreground mt-1">QR Code</p>
              </div>
              <div className="text-center w-full">
                <div className="mx-auto flex justify-center">
                  <Barcode 
                    value={barcodeValue}
                    width={1}
                    height={40}
                    fontSize={10}
                    margin={0}
                    displayValue={false}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Código de Barras</p>
              </div>
            </div>

            <div className="text-[8px] text-center text-muted-foreground border-t pt-2">
              Este ingresso é pessoal e intransferível.
              Apresente este QR Code na entrada do evento.
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">{eventTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Informações do Evento</h3>
              <div className="grid gap-2">
                <div>
                  <p className="font-medium text-muted-foreground">Data e Hora</p>
                  <p className="text-lg">{eventDate} às {eventTime}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Local</p>
                  <p className="text-lg">{location}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Área</p>
                  <p className="text-lg">{area}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Informações do Comprador</h3>
              <div className="grid gap-2">
                <div>
                  <p className="font-medium text-muted-foreground">Nome Completo</p>
                  <p className="text-lg">{buyerName}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">CPF</p>
                  <p className="text-lg">{buyerCpf}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Telefone</p>
                  <p className="text-lg">{buyerPhone || "Não informado"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Informações do Ingresso</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-medium text-muted-foreground">ID do Ingresso</p>
                <p className="text-lg">{ticketId}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Código de Segurança</p>
                <p className="text-lg">{securityCode}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Data da Compra</p>
                <p className="text-lg">{purchaseDate}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <QRCodeSVG 
                  value={qrCodeValue}
                  size={200}
                  level="H"
                  className="mx-auto"
                />
                <p className="text-sm text-muted-foreground mt-2">QR Code</p>
              </div>
              <div className="text-center">
                <div className="mx-auto">
                  <Barcode 
                    value={barcodeValue}
                    width={2}
                    height={80}
                    fontSize={14}
                    margin={0}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">Código de Barras</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
