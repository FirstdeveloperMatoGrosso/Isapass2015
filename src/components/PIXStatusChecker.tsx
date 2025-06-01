import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface PIXStatusCheckerProps {
  orderId: string;
  onPaymentSuccess: () => void;
  onPaymentFailure: () => void;
  onPaymentExpired: () => void;
}

export const PIXStatusChecker: React.FC<PIXStatusCheckerProps> = ({
  orderId,
  onPaymentSuccess,
  onPaymentFailure,
  onPaymentExpired
}) => {
  const [status, setStatus] = useState<'pending' | 'success' | 'failure' | 'expired'>('pending');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos em segundos
  const [checkCount, setCheckCount] = useState(0);

  // Simulação de verificação do status do pagamento
  useEffect(() => {
    // Apenas para simulação, em um ambiente real isso seria uma chamada à API
    const checkInterval = setInterval(() => {
      setCheckCount(prev => prev + 1);
      
      // Simular aleatoriamente uma chance de sucesso após algumas verificações
      if (checkCount > 3 && Math.random() > 0.7) {
        setStatus('success');
        onPaymentSuccess();
        clearInterval(checkInterval);
      }
    }, 3000);

    return () => clearInterval(checkInterval);
  }, [checkCount, onPaymentSuccess]);

  // Contagem regressiva do tempo de expiração
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('expired');
          onPaymentExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onPaymentExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Status:</span>
        <div className="flex items-center">
          {status === 'pending' && (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-500" />
              <span className="text-blue-600 font-medium">Aguardando pagamento</span>
            </>
          )}
          {status === 'success' && (
            <span className="text-green-600 font-medium">Pagamento confirmado!</span>
          )}
          {status === 'failure' && (
            <span className="text-red-600 font-medium">Falha no pagamento</span>
          )}
          {status === 'expired' && (
            <span className="text-orange-600 font-medium">Pagamento expirado</span>
          )}
        </div>
      </div>
      
      {status === 'pending' && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Tempo restante:</span>
          <span className="text-sm font-mono">{formatTime(timeLeft)}</span>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        {status === 'pending' && 'O status do pagamento é atualizado automaticamente.'}
        {status === 'success' && 'Seu ingresso está sendo gerado!'}
        {status === 'failure' && 'Houve um problema com seu pagamento. Tente novamente.'}
        {status === 'expired' && 'O tempo para pagamento expirou. Gere um novo PIX.'}
      </div>
    </div>
  );
};
