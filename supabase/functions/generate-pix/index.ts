import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { securityMiddleware, validateCustomerData, fraudCheck, securityHeaders } from "../middleware/security.ts";

interface CreatePixRequest {
  amount: number;
  customer: {
    name: string;
    email: string;
    document: string;
    phone: string;
  };
  event: {
    partnerId: string;      // ID da parceria/evento
    name: string;           // Nome do evento
    date: string;           // Data do evento
    location: string;       // Local do evento
    ticketType: string;     // Tipo do ingresso
    section?: string;       // Setor
    row?: string;           // Fileira
    seat?: string;          // Assento
    isHalfPrice: boolean;   // Se é meia-entrada
  };
}

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('PAGARME_API_KEY');
    if (!apiKey) {
      throw new Error('API key não configurada');
    }

    // 1. Validação do corpo da requisição
    const body: CreatePixRequest = await req.json();
    
    // 2. Middleware de Segurança
    const securityCheck = await securityMiddleware(req);
    if (securityCheck) return securityCheck;
    
    // 3. Validação dos dados do cliente
    const customerError = validateCustomerData(body.customer);
    if (customerError) {
      return new Response(
        JSON.stringify({ error: customerError }),
        { status: 400, headers: { ...securityHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Verificação anti-fraude
    const fraudResult = fraudCheck(req, { ...body.customer, amount: body.amount });
    if (fraudResult.risk >= 70) {
      return new Response(
        JSON.stringify({ 
          error: 'Transação bloqueada por suspeita de fraude',
          reasons: fraudResult.reasons
        }),
        { status: 403, headers: { ...securityHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Adiciona alerta se risco moderado
    const shouldAlert = fraudResult.risk >= 40;
    
    // Criar pedido no Pagar.me
    const orderResponse = await fetch('https://api.pagar.me/core/v5/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(apiKey + ':')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          amount: body.amount,
          description: 'Pagamento via PIX',
          quantity: 1,
          code: 'pix-payment'
        }],
        customer: {
          name: body.customer.name,
          email: body.customer.email,
          document: body.customer.document,
          type: 'individual',
          phones: {
            mobile_phone: {
              country_code: '55',
              area_code: body.customer.phone.substring(0, 2),
              number: body.customer.phone.substring(2)
            }
          }
        },
        payments: [{
          payment_method: 'pix',
          pix: {
            expires_in: 900 // 15 minutos
          }
        }],
        metadata: {
          source: 'isapass',
          integration: 'supabase-pagarme',
          timestamp: new Date().toISOString(),
          // Informações do evento
          partner_id: body.event.partnerId,
          event_name: body.event.name,
          event_date: body.event.date,
          event_location: body.event.location,
          // Informações do ingresso
          ticket_type: body.event.ticketType,
          section: body.event.section || '',
          row: body.event.row || '',
          seat: body.event.seat || '',
          is_half_price: body.event.isHalfPrice.toString(),
          // Informações do cliente
          customer_name: body.customer.name,
          customer_document: body.customer.document,
          customer_email: body.customer.email,
          customer_phone: body.customer.phone
        }
      })
    });

    if (!orderResponse.ok) {
      throw new Error('Erro ao criar pedido');
    }

    const order = await orderResponse.json();
    const charge = order.charges[0];
    const transaction = charge.last_transaction;

    return new Response(
      JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        status: order.status,
        pix: {
          qr_code: transaction.qr_code,
          qr_code_url: transaction.qr_code_url,
          expires_at: transaction.expires_at
        }
      }),
      { 
        status: 200, 
        headers: { 
          ...securityHeaders,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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
