
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CustomersPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20% desde o último mês
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <p className="text-muted-foreground">
            Lista de clientes será exibida aqui.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
