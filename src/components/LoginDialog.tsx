
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Ticket, Upload } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export const LoginDialog = ({ isOpen, onClose, isAdmin = false }: LoginDialogProps) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    address: "",
    zip_code: "",
    neighborhood: "",
    state: "",
    pix: "",
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
      // Verificar campos obrigatórios
      if (!formData.name || !formData.email || !formData.cpf || !formData.password || !formData.confirmPassword) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
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

      try {
        // Registro de novo usuário
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Update the user's profile information
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              name: formData.name,
              cpf: formData.cpf,
              phone: formData.phone,
              address: formData.address,
              zip_code: formData.zip_code,
              state: formData.state,
              neighborhood: formData.neighborhood,
              pix: formData.pix
            })
            .eq('id', authData.user.id);

          if (profileError) throw profileError;
        }

        toast.success("Conta criada com sucesso! Verifique seu email para confirmar o cadastro.");
        setIsLogin(true);
        setFormData({
          name: "",
          email: "",
          cpf: "",
          phone: "",
          address: "",
          zip_code: "",
          neighborhood: "",
          state: "",
          pix: "",
          password: "",
          confirmPassword: ""
        });
      } catch (error: any) {
        toast.error(`Erro ao criar conta: ${error.message}`);
        console.error("Erro ao criar conta:", error);
      }
    } else {
      // Login
      if (!formData.email || !formData.password) {
        toast.error("Por favor, preencha todos os campos");
        return;
      }

      try {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;

        toast.success("Login realizado com sucesso!");
        onClose();
        
        // Here's the key change - if isAdmin is true, always navigate to admin panel
        if (isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } catch (error: any) {
        toast.error(`Erro ao fazer login: ${error.message}`);
        console.error("Erro ao fazer login:", error);
      }
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
      zip_code: "",
      neighborhood: "",
      state: "",
      pix: "",
      password: "",
      confirmPassword: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center">
          {/* Logo adicionado aqui */}
          <div className="flex flex-col items-center mb-4">
            <Ticket className="h-12 w-12 text-[#0EA5E9] mb-2" />
            <div className="flex text-2xl font-bold">
              <span className="text-[#D946EF]">Isa</span>
              <span className="text-[#0EA5E9]">Pass</span>
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            {isAdmin ? "Login Administrativo" : (isLogin ? "Login" : "Cadastro")}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {!isLogin && (
            <>
              <Input 
                type="text" 
                placeholder="Nome completo *" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <MaskedInput 
                mask="999.999.999-99"
                placeholder="CPF *" 
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
              />
              <MaskedInput 
                mask="(99) 99999-9999"
                placeholder="Telefone" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <Input 
                type="text" 
                placeholder="Endereço" 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <MaskedInput 
                  mask="99999-999"
                  placeholder="CEP" 
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                />
                <Input 
                  type="text" 
                  placeholder="Bairro" 
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input 
                  type="text" 
                  placeholder="Estado" 
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
                <Input 
                  type="text" 
                  placeholder="PIX" 
                  name="pix"
                  value={formData.pix}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}
          <Input 
            type="email" 
            placeholder="Email *" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <Input 
            type="password" 
            placeholder="Senha *" 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {!isLogin && (
            <Input 
              type="password" 
              placeholder="Confirme a senha *" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          )}
          <Button type="submit" variant="default" className="w-full bg-purple-500 hover:bg-purple-600">
            {isLogin ? "Entrar" : "Cadastrar"}
          </Button>
        </form>
        
        <div className="flex flex-col items-center gap-2 text-sm">
          <button
            onClick={toggleMode}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            {isLogin 
              ? "Não tem uma conta? Cadastre-se" 
              : "Já tem uma conta? Faça login"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
