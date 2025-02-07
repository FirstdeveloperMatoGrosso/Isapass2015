import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
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
      if (!formData.name || !formData.email || !formData.cpf || !formData.password || !formData.confirmPassword) {
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

      // Simulating successful registration
      localStorage.setItem('userData', JSON.stringify({
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf
      }));
      
      toast.success("Conta criada com sucesso!");
      setIsLogin(true);
      setFormData({
        name: "",
        email: "",
        cpf: "",
        password: "",
        confirmPassword: ""
      });
    } else {
      if (!formData.email || !formData.password) {
        toast.error("Por favor, preencha todos os campos");
        return;
      }

      // Simulating successful login
      const mockUserData = {
        name: "Usuário Teste",
        email: formData.email,
        cpf: "123.456.789-00"
      };
      localStorage.setItem('userData', JSON.stringify(mockUserData));
      
      toast.success("Login realizado com sucesso!");
      navigate("/");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      cpf: "",
      password: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
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