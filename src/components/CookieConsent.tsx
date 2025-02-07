
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const { toast } = useToast();

  const handleAccept = () => {
    setShowConsent(false);
    localStorage.setItem("cookieConsent", "accepted");
    toast({
      description: "Preferências de cookies salvas com sucesso!",
    });
  };

  if (!showConsent || localStorage.getItem("cookieConsent")) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background rounded-lg shadow-lg p-6 max-w-md mx-4">
          <div className="space-y-4">
            <p className="text-sm text-foreground/80">
              Nós utilizamos os cookies para otimizar e aprimorar a sua navegação do site.
            </p>
            <p className="text-sm text-foreground/80">
              Ao continuar navegando você concorda sobre o uso de Cookies na forma definida em 'Preferências' e também concorda com a nossa Política de Privacidade
            </p>
            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowPreferences(true)}
              >
                Preferências
              </Button>
              <Button onClick={handleAccept}>
                Entendi
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preferências de Cookies</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Utilizamos cookies necessários para o funcionamento básico do site e cookies opcionais para melhorar sua experiência.
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setShowPreferences(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
