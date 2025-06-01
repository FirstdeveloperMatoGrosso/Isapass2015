
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);

  
  const handleAccept = () => {
    setShowConsent(false);

  };
  
  if (!showConsent) {
    return null;
  }
  
  return <>
      <div className="fixed bottom-4 left-4 z-50 max-w-xs">
        <div className="bg-background rounded-lg shadow-lg p-4 border border-border/50 backdrop-blur-sm">
          <div className="space-y-3">
            <p className="text-xs text-foreground/80 leading-relaxed">
              Nós utilizamos os cookies para otimizar e aprimorar a sua navegação do site.
            </p>
            <p className="text-xs text-foreground/80 leading-relaxed">
              Ao continuar navegando você concorda sobre o uso de Cookies na forma definida em 'Preferências' e também concorda com a nossa Política de Privacidade
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowPreferences(true)} className="text-xs py-1 h-8 bg-yellow-500 hover:bg-yellow-400 text-slate-100">
                Preferências
              </Button>
              <Button onClick={handleAccept} className="text-xs py-1 h-8 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
                Entendi
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Preferências de Cookies</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Utilizamos cookies necessários para o funcionamento básico do site e cookies opcionais para melhorar sua experiência.
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setShowPreferences(false)} className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90">
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>;
};
