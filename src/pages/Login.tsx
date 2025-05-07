
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Ticket } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin) {
      if (!formData.name || !formData.email || !formData.cpf || !formData.phone || !formData.address || !formData.password || !formData.confirmPassword) {
        toast.error("Por favor, preencha todos os campos");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }

      if (formData.password.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres");
        return;
      }

      toast.success("Conta criada com sucesso!");
      setIsLogin(true);
      setFormData({
        name: "",
        email: "",
        cpf: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: ""
      });
    } else {
      if (!formData.email || !formData.password) {
        toast.error("Por favor, preencha todos os campos");
        return;
      }

      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      cpf: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center">
            {/* Logo adicionado aqui */}
            <div className="flex flex-col items-center mb-4">
              <Ticket className="h-12 w-12 text-[#0EA5E9] mb-2" />
              <div className="flex text-2xl font-bold">
                <span className="text-[#D946EF]">Isa</span>
                <span className="text-[#0EA5E9]">Pass</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {isAdmin ? "Login Administrativo" : (isLogin ? "Login" : "Cadastro")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <Input 
                    type="text" 
                    placeholder="Nome completo" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <Input 
                    type="text" 
                    placeholder="CPF" 
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                  />
                  <Input 
                    type="tel" 
                    placeholder="Telefone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <Input 
                    type="text" 
                    placeholder="Endereço completo" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </>
              )}
              <Input 
                type="email" 
                placeholder="Email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <Input 
                type="password" 
                placeholder="Senha" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {!isLogin && (
                <Input 
                  type="password" 
                  placeholder="Confirme a senha" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              )}
              <Button type="submit" variant="default" className="w-full">
                {isLogin ? "Entrar" : "Cadastrar"}
              </Button>
            </form>
            <div className="flex flex-col items-center gap-2 text-sm">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {isAdmin ? "Área do Cliente" : "Área Administrativa"}
              </button>
              <button
                onClick={toggleMode}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {isLogin 
                  ? "Não tem uma conta? Cadastre-se" 
                  : "Já tem uma conta? Faça login"}
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Login;
