import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface Request {
  method: string;
  json(): Promise<any>;
}

interface OrderResponse {
  status: string;
  [key: string]: any;
}

interface RequestBody {
  order_id: string;
  metadata?: {
    timestamp: string;
    attempt: number;
    max_attempts: number;
  };
}

interface PaymentResponse {
  status: 'pending' | 'paid' | 'failed' | 'expired';
  message?: string;
  data?: any;
}

serve(async (req: Request) => {
  try {
    // Verificar método
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Pegar API key do ambiente
    const apiKey = Deno.env.get('PAGARME_API_KEY');
    if (!apiKey) {
      throw new Error('API key não configurada');
    }

    // Pegar dados da requisição
    const body: RequestBody = await req.json();
    const { order_id, metadata } = body;

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: 'order_id é obrigatório' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Log dos metadados
    console.log('Verificando status do pagamento:', {
      order_id,
      metadata,
      timestamp: new Date().toISOString()
    });

    // Fazer requisição para a API do Pagar.me
    const pagarmeResponse = await fetch(
      `https://api.pagar.me/core/v5/orders/${order_id}`,
      {
        headers: {
          'Authorization': `Basic ${btoa(apiKey + ':')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!pagarmeResponse.ok) {
      throw new Error('Erro ao consultar API do Pagar.me');
    }

    const data = await pagarmeResponse.json() as OrderResponse;
    let response: PaymentResponse;

    // Analisar status do pagamento
    if (data.status === 'paid') {
      response = { 
        status: 'paid',
        message: 'Pagamento confirmado',
        data 
      };
    } else if (data.status === 'failed' || data.status === 'canceled') {
      response = { 
        status: 'failed',
        message: 'Pagamento falhou ou foi cancelado',
        data 
      };
    } else if (data.status === 'expired') {
      response = { 
        status: 'expired',
        message: 'Pagamento expirou',
        data 
      };
    } else {
      response = { 
        status: 'pending',
        message: 'Aguardando pagamento',
        data 
      };
    }

    // Retornar resposta
    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        } 
      }
    );

  } catch (error) {
    console.error('Erro:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro interno' 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
});
