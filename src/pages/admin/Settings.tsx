
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShareOptions } from "@/components/ShareOptions";

const SettingsPage = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShareOptions />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Impressão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Formato do Ingresso</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="a4" name="format" value="a4" />
                  <Label htmlFor="a4">A4</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="thermal" name="format" value="thermal" />
                  <Label htmlFor="thermal">Térmica</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Impressora Padrão</Label>
              <Input placeholder="Selecione a impressora" />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="auto-print" />
              <Label htmlFor="auto-print">Impressão automática</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input type="password" placeholder="••••••••" />
            </div>

            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <Input placeholder="https://" />
            </div>

            <Button>Salvar Configurações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personalização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logo da Empresa</Label>
              <Input type="file" accept="image/*" />
            </div>

            <div className="space-y-2">
              <Label>Cores Principais</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input type="color" />
                <Input type="color" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="email-notifications" />
              <Label htmlFor="email-notifications">Notificações por Email</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="sms-notifications" />
              <Label htmlFor="sms-notifications">Notificações por SMS</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="whatsapp-notifications" />
              <Label htmlFor="whatsapp-notifications">Notificações por WhatsApp</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
