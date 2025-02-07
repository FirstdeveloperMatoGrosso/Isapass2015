
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
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4 shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col gap-4">
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
