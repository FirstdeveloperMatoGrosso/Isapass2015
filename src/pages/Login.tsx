
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

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
            {!isLogin && (
              <Input type="text" placeholder="Nome completo" />
            )}
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Senha" />
            {!isLogin && (
              <Input type="password" placeholder="Confirme a senha" />
            )}
            <Button className="w-full">
              {isLogin ? "Entrar" : "Cadastrar"}
            </Button>
            <div className="flex flex-col items-center gap-2 text-sm">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {isAdmin ? "Área do Cliente" : "Área Administrativa"}
              </button>
              <button
                onClick={() => setIsLogin(!isLogin)}
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
