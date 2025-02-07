import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {isAdmin ? "Login Administrativo" : "Login"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Senha" />
            <Button className="w-full">Entrar</Button>
            <div className="text-center">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isAdmin ? "Área do Cliente" : "Área Administrativa"}
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Login;