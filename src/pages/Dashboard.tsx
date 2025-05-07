
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Share2, Mail, MessageCircle, Upload, UserRound, Phone, MapPin } from "lucide-react";
import { DigitalTicket } from "@/components/DigitalTicket";
import { UserCredential } from "@/components/UserCredential";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [userData, setUserData] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    address: "",
    zip_code: "",
    state: "",
    neighborhood: "",
    pix: "",
    photo_url: ""
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }

      try {
        // Buscar dados do perfil
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile) {
          setUserProfile(profile);
          setFormData({
            name: profile.name || "",
            email: profile.email || "",
            cpf: profile.cpf || "",
            phone: profile.phone || "",
            address: profile.address || "",
            zip_code: profile.zip_code || "",
            state: profile.state || "",
            neighborhood: profile.neighborhood || "",
            pix: profile.pix || "",
            photo_url: profile.photo_url || ""
          });
        }

        // Buscar compras (tickets)
        const { data: tickets, error: ticketsError } = await supabase
          .from("tickets")
          .select(`
            *,
            events(*)
          `)
          .eq("user_id", session.user.id);

        if (ticketsError) throw ticketsError;

        if (tickets && tickets.length > 0) {
          const formattedPurchases = tickets.map(ticket => {
            const event = ticket.events;
            return {
              id: ticket.ticket_id,
              eventTitle: event?.title || "Evento",
              date: event?.date || new Date().toISOString(),
              price: ticket.price,
              ticket: {
                ticketId: ticket.ticket_id,
                securityCode: ticket.security_code,
                purchaseDate: new Date(ticket.purchase_date).toLocaleString('pt-BR'),
                eventTitle: event?.title || "Evento",
                eventDate: new Date(event?.date).toLocaleDateString('pt-BR') || "Data não definida",
                eventTime: new Date(event?.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) || "Horário não definido",
                location: event?.location || "Local não definido",
                area: ticket.area || "Área não definida",
                buyerName: profile?.name,
                buyerCpf: profile?.cpf
              }
            };
          });
          
          setPurchases(formattedPurchases);
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
                purchaseDate: "20/02/2024 14:30",
                eventTitle: "Show do Metallica",
                eventDate: "15/05/2024",
                eventTime: "20:00",
                location: "Allianz Parque - São Paulo, SP",
                area: "Pista Premium",
                buyerName: profile?.name,
                buyerCpf: profile?.cpf
              }
            }
          ];
          setPurchases(mockPurchases);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        toast.error('Erro ao carregar dados do usuário');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `profile-photos/${fileName}`;

    try {
      setIsUploading(true);

      // Verificar se existe o bucket, se não existir, criar
      const { data: bucketExists, error: bucketCheckError } = await supabase.storage.getBucket('profile-photos');
      if (bucketCheckError && bucketCheckError.message.includes('does not exist')) {
        await supabase.storage.createBucket('profile-photos', {
          public: true
        });
      }

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obter URL pública do arquivo
      const { data: publicUrlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      if (!publicUrlData) throw new Error('Falha ao obter URL pública');

      // Atualizar o formData com a nova URL da foto
      setFormData({
        ...formData,
        photo_url: publicUrlData.publicUrl
      });

      toast.success('Foto enviada com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao enviar foto: ${error.message}`);
      console.error('Erro ao enviar foto:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          phone: formData.phone,
          address: formData.address,
          zip_code: formData.zip_code,
          state: formData.state,
          neighborhood: formData.neighborhood,
          pix: formData.pix,
          photo_url: formData.photo_url
        })
        .eq('id', session.user.id);

      if (error) throw error;

      // Atualizar o estado do perfil
      setUserProfile({
        ...userProfile,
        ...formData
      });
      
      setEditMode(false);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
      console.error('Erro ao atualizar perfil:', error);
    }
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
          <TabsList className="w-full sm:w-auto flex">
            <TabsTrigger value="profile" className="flex-1 sm:flex-initial">Perfil</TabsTrigger>
            <TabsTrigger value="purchases" className="flex-1 sm:flex-initial">Compras</TabsTrigger>
            <TabsTrigger value="credential" className="flex-1 sm:flex-initial">Credencial</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardContent className="space-y-4 pt-6">
                {editMode ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-4 mb-6">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted">
                        {formData.photo_url ? (
                          <img src={formData.photo_url} alt="Foto de perfil" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                            {formData.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="photo-upload" className="cursor-pointer">
                          <Button variant="outline" type="button" disabled={isUploading} className="relative">
                            <Upload className="mr-2 h-4 w-4" />
                            {isUploading ? "Enviando..." : "Atualizar foto"}
                            <input
                              id="photo-upload"
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={handleFileChange}
                              disabled={isUploading}
                            />
                          </Button>
                        </label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-2">
                        <UserRound className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Nome completo"
                          className="flex-grow"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email"
                          className="flex-grow"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <UserRound className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                        <MaskedInput
                          name="cpf"
                          mask="999.999.999-99"
                          value={formData.cpf}
                          onChange={handleInputChange}
                          placeholder="CPF"
                          className="flex-grow"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                        <MaskedInput
                          name="phone"
                          mask="(99) 99999-9999"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Telefone"
                          className="flex-grow"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Endereço"
                          className="flex-grow"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <MaskedInput
                        name="zip_code"
                        mask="99999-999"
                        value={formData.zip_code}
                        onChange={handleInputChange}
                        placeholder="CEP"
                      />
                      <Input
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleInputChange}
                        placeholder="Bairro"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Estado"
                      />
                      <Input
                        name="pix"
                        value={formData.pix}
                        onChange={handleInputChange}
                        placeholder="PIX"
                      />
                    </div>
                    
                    <div className="flex flex-col xs:flex-row gap-4 pt-4">
                      <Button onClick={handleSaveProfile} className="w-full xs:w-auto bg-purple-500 hover:bg-purple-600">
                        Salvar
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditMode(false)}
                        className="w-full xs:w-auto"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center mb-6">
                      {userProfile?.photo_url ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                          <img src={userProfile.photo_url} alt="Foto de perfil" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-muted mb-4 flex items-center justify-center">
                          <span className="text-4xl font-bold text-muted-foreground">
                            {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                      <h2 className="text-xl font-bold text-center">
                        {userProfile?.name || "Usuário"}
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">NOME COMPLETO</h3>
                        <p className="text-lg">{userProfile?.name || "Não informado"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">EMAIL</h3>
                        <p className="text-lg break-all">{userProfile?.email || "Não informado"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">CPF</h3>
                        <p className="text-lg">{userProfile?.cpf || "Não informado"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">TELEFONE</h3>
                        <p className="text-lg">{userProfile?.phone || "Não informado"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">ENDEREÇO</h3>
                        <p className="text-lg">{userProfile?.address || "Não informado"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">CEP</h3>
                        <p className="text-lg">{userProfile?.zip_code || "Não informado"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">BAIRRO</h3>
                        <p className="text-lg">{userProfile?.neighborhood || "Não informado"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">ESTADO</h3>
                        <p className="text-lg">{userProfile?.state || "Não informado"}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground">PIX</h3>
                        <p className="text-lg">{userProfile?.pix || "Não informado"}</p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setEditMode(true)} 
                      className="mt-6 bg-purple-500 hover:bg-purple-600"
                    >
                      Editar Perfil
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <Card>
              <CardContent className="pt-6">
                {!isMobile ? (
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
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <Card key={purchase.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold">{purchase.eventTitle}</h3>
                              <span className="text-sm text-muted-foreground">{purchase.date}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>ID: {purchase.id}</span>
                              <span className="font-medium">R$ {purchase.price.toFixed(2)}</span>
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
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
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {purchases.map((purchase) => (
                  <div key={purchase.id} className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Ingresso Digital</h3>
                    <DigitalTicket {...purchase.ticket} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credential">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Minha Credencial</h3>
                  <p className="text-muted-foreground">
                    Utilize esta credencial para identificação nos eventos
                  </p>
                </div>
                
                {userProfile && (
                  <div className="flex justify-center">
                    <UserCredential 
                      id={userProfile.id}
                      name={userProfile.name || ""}
                      cpf={userProfile.cpf || ""}
                      email={userProfile.email || ""}
                      phone={userProfile.phone}
                      address={userProfile.address}
                      zip_code={userProfile.zip_code}
                      state={userProfile.state}
                      neighborhood={userProfile.neighborhood}
                      photo_url={userProfile.photo_url}
                      pix={userProfile.pix}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
