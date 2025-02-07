
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";

const mockCustomers = [
  { id: 1, name: "João Silva", email: "joao@email.com", phone: "(11) 99999-9999", lastPurchase: "2024-02-20" },
  { id: 2, name: "Maria Santos", email: "maria@email.com", phone: "(11) 88888-8888", lastPurchase: "2024-02-19" },
];

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Clientes</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20% desde o último mês
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <CardTitle>Lista de Clientes</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[600px] rounded-md border">
            <div className="grid grid-cols-5 gap-4 p-4 font-medium">
              <div>Nome</div>
              <div>Email</div>
              <div>Telefone</div>
              <div>Última Compra</div>
              <div>Ações</div>
            </div>
            {mockCustomers.map((customer) => (
              <div key={customer.id} className="grid grid-cols-5 gap-4 border-t p-4">
                <div className="truncate">{customer.name}</div>
                <div className="truncate">{customer.email}</div>
                <div className="truncate">{customer.phone}</div>
                <div>{new Date(customer.lastPurchase).toLocaleDateString()}</div>
                <div>
                  <Button variant="ghost" size="sm">
                    Ver detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersPage;

