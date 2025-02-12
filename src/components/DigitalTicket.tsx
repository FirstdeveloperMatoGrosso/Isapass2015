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
        <Card className="w-full max-w-2xl mx-auto bg-white hover:bg-gray-50 cursor-pointer transition-colors">
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-semibold">Nome:</p>
                  <p>{buyerName}</p>
                </div>
                <div>
                  <p className="font-semibold">CPF:</p>
                  <p>{buyerCpf}</p>
                </div>
                <div>
                  <p className="font-semibold">Telefone:</p>
                  <p>{buyerPhone || "Não informado"}</p>
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
                <QRCodeSVG 
                  value={qrCodeValue}
                  size={128}
                  level="H"
                  className="mx-auto"
                />
                <p className="text-sm text-muted-foreground mt-2">QR Code</p>
              </div>
              <div className="text-center mx-auto">
                <div className="mx-auto">
                  <Barcode 
                    value={barcodeValue}
                    width={1.5}
                    height={40}
                    fontSize={12}
                    margin={0}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">Código de Barras</p>
              </div>
            </div>

            <div className="border-t pt-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                PROIBIDA A VENDA E O CONSUMO DE BEBIDAS ALCOÓLICAS PARA MENORES DE 18 ANOS
                LEI FEDERAL 8.069/90 - ARTIGO 81
              </p>
              <p className="text-xs text-muted-foreground">
                Código do Consumidor - Decreto 2.181/97 - RAC/PROCON
              </p>
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

          <div className="border-t pt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              PROIBIDA A VENDA E O CONSUMO DE BEBIDAS ALCOÓLICAS PARA MENORES DE 18 ANOS
              LEI FEDERAL 8.069/90 - ARTIGO 81
            </p>
            <p className="text-xs text-muted-foreground">
              Código do Consumidor - Decreto 2.181/97 - RAC/PROCON
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
