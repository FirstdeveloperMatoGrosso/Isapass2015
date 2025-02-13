
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Share2, Mail, MessageCircle } from "lucide-react";
import { DigitalTicket } from "@/components/DigitalTicket";

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      setFormData(parsedData);

      // Carregar compras do localStorage
      const storedPurchases = localStorage.getItem('purchases');
      if (storedPurchases) {
        setPurchases(JSON.parse(storedPurchases));
      } else {
        // Mock purchase data se não houver compras
        const mockPurchases = [
          {
            id: "TK123456",
            eventTitle: "Show do Metallica",
            date: "2024-05-15",
            price: 450.00,
            ticket: {
              ticketId: "TK123456",
              securityCode: "ABC123",
              purchaseDate: "2024-02-20 14:30",
              eventTitle: "Show do Metallica",
              eventDate: "15/05/2024",
              eventTime: "20:00",
              location: "Allianz Parque - São Paulo, SP",
              area: "Pista Premium",
              buyerName: parsedData?.name,
              buyerCpf: parsedData?.cpf
            }
          }
        ];
        setPurchases(mockPurchases);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = () => {
    localStorage.setItem('userData', JSON.stringify(formData));
    setUserData(formData);
    setEditMode(false);
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleShareTicket = (ticket: any, method: 'email' | 'whatsapp' | 'telegram') => {
    // In a real app, this would integrate with actual sharing APIs
    switch (method) {
      case 'email':
        toast.success("Ingresso enviado para seu email!");
        break;
      case 'whatsapp':
        toast.success("Ingresso compartilhado via WhatsApp!");
        break;
      case 'telegram':
        toast.success("Ingresso compartilhado via Telegram!");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Minha Conta</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="purchases">Compras</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardContent className="space-y-4 pt-6">
                {editMode ? (
                  <div className="space-y-4">
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nome completo"
                    />
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                    />
                    <Input
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      placeholder="CPF"
                    />
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Telefone"
                    />
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Endereço"
                    />
                    <div className="flex gap-4">
                      <Button onClick={handleSaveProfile}>Salvar</Button>
                      <Button variant="outline" onClick={() => setEditMode(false)}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p><strong>Nome:</strong> {userData?.name}</p>
                    <p><strong>Email:</strong> {userData?.email}</p>
                    <p><strong>CPF:</strong> {userData?.cpf}</p>
                    <p><strong>Telefone:</strong> {userData?.phone}</p>
                    <p><strong>Endereço:</strong> {userData?.address}</p>
                    <Button onClick={() => setEditMode(true)}>Editar Perfil</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Evento</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>{purchase.id}</TableCell>
                        <TableCell>{purchase.eventTitle}</TableCell>
                        <TableCell>{purchase.date}</TableCell>
                        <TableCell>R$ {purchase.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShareTicket(purchase.ticket, 'email')}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShareTicket(purchase.ticket, 'whatsapp')}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShareTicket(purchase.ticket, 'telegram')}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {purchases.map((purchase) => (
                  <div key={purchase.id} className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Ingresso Digital</h3>
                    <DigitalTicket {...purchase.ticket} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
