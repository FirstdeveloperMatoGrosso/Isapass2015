
import { Card, CardContent } from "@/components/ui/card";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserCredentialProps {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone?: string;
  address?: string;
  zip_code?: string;
  state?: string;
  neighborhood?: string;
  photo_url?: string;
  pix?: string;
}

export const UserCredential = ({
  id,
  name,
  cpf,
  email,
  phone,
  address,
  zip_code,
  state,
  neighborhood,
  photo_url,
  pix
}: UserCredentialProps) => {
  const userData = {
    id,
    name,
    cpf,
    email
  };

  const qrCodeValue = JSON.stringify(userData);
  const barcodeValue = `ID${id?.substring(0, 10)}`;
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="w-full max-w-[350px] mx-auto bg-white hover:bg-gray-50 cursor-pointer transition-colors">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-4 border-b pb-3">
              <Avatar className="h-16 w-16">
                {photo_url && <AvatarImage src={photo_url} alt={name} />}
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-bold">{name}</h2>
                <p className="text-sm text-muted-foreground">Credencial de Usuário</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">CPF:</span>
                <span>{cpf}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Email:</span>
                <span className="truncate max-w-[200px]">{email}</span>
              </div>
              {phone && (
                <div className="flex justify-between">
                  <span className="font-semibold">Telefone:</span>
                  <span>{phone}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-2 pt-2 border-t">
              <QRCodeSVG 
                value={qrCodeValue}
                size={150}
                level="H"
                className="mx-auto"
              />
              <div className="text-center w-full mt-2">
                <Barcode 
                  value={barcodeValue}
                  width={1.5}
                  height={40}
                  fontSize={12}
                  margin={0}
                  displayValue={true}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">Credencial de Usuário</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                {photo_url && <AvatarImage src={photo_url} alt={name} />}
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-center">{name}</h3>
              <div className="w-full">
                <QRCodeSVG 
                  value={qrCodeValue}
                  size={180}
                  level="H"
                  className="mx-auto"
                />
              </div>
              <div className="text-center w-full">
                <Barcode 
                  value={barcodeValue}
                  width={2}
                  height={60}
                  fontSize={14}
                  margin={0}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">NOME COMPLETO</h3>
                  <p className="text-lg">{name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">CPF</h3>
                  <p className="text-lg">{cpf}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">EMAIL</h3>
                  <p className="text-lg break-all">{email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">TELEFONE</h3>
                  <p className="text-lg">{phone || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">PIX</h3>
                  <p className="text-lg">{pix || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">CEP</h3>
                  <p className="text-lg">{zip_code || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">BAIRRO</h3>
                  <p className="text-lg">{neighborhood || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">ESTADO</h3>
                  <p className="text-lg">{state || "Não informado"}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground">ENDEREÇO COMPLETO</h3>
                <p className="text-lg">{address || "Não informado"}</p>
              </div>

              <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                <p>ID: {id}</p>
                <p className="mt-2">Esta credencial é pessoal e intransferível.</p>
                <p>Apresente esta credencial para acesso aos eventos.</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
