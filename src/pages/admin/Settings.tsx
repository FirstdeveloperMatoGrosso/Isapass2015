
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Impressão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configurações para impressão de ingressos e pulseiras.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configurações de integração com outros sistemas.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
