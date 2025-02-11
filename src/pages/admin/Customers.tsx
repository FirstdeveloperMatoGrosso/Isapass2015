
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, UserPlus, Edit, Lock, Trash2, User, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CustomerType = "individual" | "company";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: CustomerType;
  address: string;
  city: string;
  state: string;
  lastPurchase: string;
  blocked: boolean;
}

const mockCustomers: Customer[] = [
  { 
    id: 1, 
    name: "João Silva", 
    email: "joao@email.com", 
    phone: "(11) 99999-9999",
    document: "123.456.789-00",
    type: "individual",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    lastPurchase: "2024-02-20",
    blocked: false
  },
  { 
    id: 2, 
    name: "Tech Solutions Ltd", 
    email: "contact@techsolutions.com", 
    phone: "(11) 88888-8888",
    document: "12.345.678/0001-90",
    type: "company",
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    lastPurchase: "2024-02-19",
    blocked: true
  },
];

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    type: "individual" as CustomerType,
    address: "",
    city: "",
    state: "",
  });
  const { toast } = useToast();
  
  const handleBlock = (customer: Customer) => {
    toast({
      title: `Cliente ${customer.blocked ? "desbloqueado" : "bloqueado"}`,
      description: `${customer.name} foi ${customer.blocked ? "desbloqueado" : "bloqueado"} com sucesso.`,
    });
  };

  const handleDelete = (customer: Customer) => {
    toast({
      title: "Cliente excluído",
      description: `${customer.name} foi excluído com sucesso.`,
    });
  };

  const handleEdit = (customer: Customer) => {
    toast({
      title: "Editar cliente",
      description: `Editando informações de ${customer.name}`,
    });
  };

  const handleNewCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Cliente cadastrado",
      description: `${newCustomer.name} foi cadastrado com sucesso.`,
    });
    setIsNewCustomerOpen(false);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      document: "",
      type: "individual",
      address: "",
      city: "",
      state: "",
    });
  };
  
  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto hover:scale-105 transition-transform">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleNewCustomerSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Tipo de Cliente</Label>
                  <RadioGroup
                    value={newCustomer.type}
                    onValueChange={(value: CustomerType) =>
                      setNewCustomer({ ...newCustomer, type: value })
                    }
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Pessoa Física
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company" className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        Pessoa Jurídica
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome {newCustomer.type === 'company' ? 'da Empresa' : 'Completo'}</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      placeholder={newCustomer.type === 'company' ? 'Nome da Empresa' : 'Nome Completo'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="document">{newCustomer.type === 'company' ? 'CNPJ' : 'CPF'}</Label>
                    <Input
                      id="document"
                      value={newCustomer.document}
                      onChange={(e) => setNewCustomer({ ...newCustomer, document: e.target.value })}
                      placeholder={newCustomer.type === 'company' ? '00.000.000/0000-00' : '000.000.000-00'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    placeholder="Rua, número, complemento"
                  />
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={newCustomer.city}
                      onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                      placeholder="Cidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={newCustomer.state}
                      onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                      placeholder="Estado"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsNewCustomerOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Cadastrar Cliente</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
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
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pessoas Físicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">
              72% dos clientes
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pessoas Jurídicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              28% dos clientes
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Bloqueados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-destructive">23</div>
            <p className="text-xs text-muted-foreground">
              1.8% dos clientes
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
          <div className="min-w-[700px] rounded-md border">
            <div className="grid grid-cols-9 gap-4 p-4 font-medium bg-muted/50">
              <div>Tipo</div>
              <div>Nome</div>
              <div>Documento</div>
              <div>Email</div>
              <div>Telefone</div>
              <div>Cidade/Estado</div>
              <div>Última Compra</div>
              <div>Status</div>
              <div>Ações</div>
            </div>
            {mockCustomers.map((customer) => (
              <div key={customer.id} className="grid grid-cols-9 gap-4 border-t p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2">
                  {customer.type === "individual" ? (
                    <User className="h-4 w-4 text-primary" />
                  ) : (
                    <Building2 className="h-4 w-4 text-secondary" />
                  )}
                  <span className="text-sm">{customer.type === "individual" ? "PF" : "PJ"}</span>
                </div>
                <div className="truncate font-medium">{customer.name}</div>
                <div className="truncate text-muted-foreground">{customer.document}</div>
                <div className="truncate text-muted-foreground">{customer.email}</div>
                <div className="truncate text-muted-foreground">{customer.phone}</div>
                <div className="truncate text-muted-foreground">{customer.city}/{customer.state}</div>
                <div className="text-muted-foreground">{new Date(customer.lastPurchase).toLocaleDateString()}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    customer.blocked 
                      ? "bg-destructive/10 text-destructive" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {customer.blocked ? "Bloqueado" : "Ativo"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-primary"
                    onClick={() => handleEdit(customer)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${customer.blocked ? "hover:text-green-600" : "hover:text-destructive"}`}
                    onClick={() => handleBlock(customer)}
                  >
                    <Lock className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-destructive"
                    onClick={() => handleDelete(customer)}
                  >
                    <Trash2 className="h-4 w-4" />
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
