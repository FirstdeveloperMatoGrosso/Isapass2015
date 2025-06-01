import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PIXPaymentStatusProps {
  orderId: string;
  onPaymentSuccess: () => void;
  onPaymentFailure: () => void;
  onPaymentExpired: () => void;
  pollingInterval?: number; // em segundos
}

export function PIXPaymentStatus({
  orderId,
  onPaymentSuccess,
  onPaymentFailure,
  onPaymentExpired,
  pollingInterval = 5
}: PIXPaymentStatusProps) {
  const [status, setStatus] = useState<'pending' | 'paid' | 'failed' | 'expired'>('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 180; // 15 minutos (180 * 5 segundos)

    const checkStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/check-pix-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            order_id: orderId,
            metadata: {
              timestamp: new Date().toISOString(),
              attempt: attempts + 1,
              max_attempts: maxAttempts
            }
          })
        });

        if (!response.ok) {
          throw new Error('Falha ao verificar status');
        }

        const data = await response.json();
        
        switch (data.status) {
          case 'paid':
            setStatus('paid');
            onPaymentSuccess();
            clearInterval(intervalId);
            break;
          case 'failed':
            setStatus('failed');
            onPaymentFailure();
            clearInterval(intervalId);
            break;
          case 'expired':
            setStatus('expired');
            onPaymentExpired();
            clearInterval(intervalId);
            break;
          case 'pending':
            attempts++;
            if (attempts >= maxAttempts) {
              setStatus('expired');
              onPaymentExpired();
              clearInterval(intervalId);
            }
            break;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        clearInterval(intervalId);
      }
    };

    // Primeira verificação imediata
    checkStatus();

    // Polling a cada X segundos
    intervalId = setInterval(checkStatus, pollingInterval * 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [orderId, onPaymentSuccess, onPaymentFailure, onPaymentExpired, pollingInterval]);

  // Componente não renderiza nada visualmente, apenas faz o polling
  return null;
}
