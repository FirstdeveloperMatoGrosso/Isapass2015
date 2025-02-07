
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Aqui você pode adicionar a lógica de autenticação/cadastro
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Limpa os campos do formulário ao alternar
    setFormData({
      name: "",
      email: "",
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
                <Input 
                  type="text" 
                  placeholder="Nome completo" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
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
