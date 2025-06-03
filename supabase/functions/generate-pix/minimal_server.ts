// Servidor HTTP mínimo para Deno 1.44.1

// Declaração de tipos para o Deno
declare namespace Deno {
  export function listen(options: { port: number }): any;
  export function serveHttp(conn: any): any;
  export const env: {
    get(key: string): string | undefined;
  };
}

export {};

// Configurações
const PAGARME_API_KEY = Deno.env.get('PAGARME_API_KEY');
const SERVER_PORT = 8099; // Usando uma porta alternativa para evitar conflitos

// Verificar se a chave da API está disponível
if (!PAGARME_API_KEY) {
  console.error('PAGARME_API_KEY não definida');
  console.error('Execute: export PAGARME_API_KEY=sua_chave_api');
  throw new Error('PAGARME_API_KEY não definida');
}

console.log(`Iniciando servidor HTTP mínimo na porta ${SERVER_PORT}`);

// Função para gerar headers CORS
function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

// Manipulador de requisições
async function handleRequest(request: Request): Promise<Response> {
  console.log("Requisição recebida:", request.method, request.url);
  
  // Tratar CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    });
  }
  
  // Apenas permitir POST para a rota principal
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), {
      status: 405,
      headers: corsHeaders()
    });
  }
  
  try {
    // Processar corpo da requisição
    const bodyText = await request.text();
    console.log("Corpo da requisição:", bodyText);
    
    // Analisar o JSON
    const body = bodyText ? JSON.parse(bodyText) : {};
    
    // Preparar metadados
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const metadata = {
      source: 'isapass',
      integration: 'deno-pagarme',
      timestamp,
      partner_id: body.event?.partnerId || '',
      event_name: body.event?.name || '',
      event_date: body.event?.date || '',
      event_location: body.event?.location || '',
      ticket_type: body.event?.ticketType || '',
      section: body.event?.section || '',
      row: body.event?.row || '',
      seat: body.event?.seat || '',
      is_half_price: body.event?.isHalfPrice?.toString() || 'false',
      customer_name: body.customer?.name || '',
      customer_document: body.customer?.document || '',
      customer_email: body.customer?.email || '',
      customer_phone: body.customer?.phone || ''
    };
    
    // Preparar payload para o Pagar.me
    const phoneNumber = body.customer?.phone || '11999999999';
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    const areaCode = cleanedPhone.substring(0, 2);
    const number = cleanedPhone.substring(2);
    
    const pagarmePayload = {
      items: [
        {
          amount: body.amount || 1000,
          description: `Ingresso ${body.event?.ticketType || 'Standard'} - ${body.event?.name || 'Evento'}`,
          quantity: 1,
          code: 'pix-payment'
        }
      ],
      customer: {
        name: body.customer?.name || 'Cliente Teste',
        email: body.customer?.email || 'cliente@teste.com',
        type: 'individual',
        document: body.customer?.document || '83432616074',
        phones: {
          mobile_phone: {
            country_code: '55',
            area_code: areaCode,
            number: number
          }
        }
      },
      payments: [
        {
          payment_method: 'pix',
          pix: {
            expires_in: 60 * 15 // 15 minutos
          }
        }
      ],
      metadata
    };
    
    try {
      console.log('Enviando requisição para o Pagar.me:', JSON.stringify(pagarmePayload, null, 2));
      
      // Fazer requisição para a API do Pagar.me
      const pagarmeResponse = await fetch('https://api.pagar.me/core/v5/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(PAGARME_API_KEY + ':')}`
        },
        body: JSON.stringify(pagarmePayload)
      });
      
      const pagarmeData = await pagarmeResponse.json();
      console.log('Resposta do Pagar.me:', JSON.stringify(pagarmeData, null, 2));
      
      if (!pagarmeResponse.ok) {
        throw new Error(`Erro na API do Pagar.me: ${pagarmeData.message || 'Erro desconhecido'}`);
      }
      
      // Extrair dados relevantes da resposta
      const charge = pagarmeData.charges?.[0];
      const transaction = charge?.last_transaction;
      const qrCode = transaction?.qr_code;
      const qrCodeUrl = transaction?.qr_code_url;
      const expiresAt = transaction?.expires_at;
      
      // Formatar resposta para o cliente
      return new Response(JSON.stringify({
        order_id: pagarmeData.id,
        amount: body.amount,
        status: pagarmeData.status,
        customer: {
          name: body.customer?.name,
          email: body.customer?.email,
          document: body.customer?.document,
          phone: body.customer?.phone
        },
        pix: {
          qr_code: qrCode,
          qr_code_url: qrCodeUrl,
          expires_at: expiresAt
        },
        metadata
      }), {
        status: 200,
        headers: corsHeaders()
      });
    } catch (apiError) {
      console.error('Erro ao processar pagamento:', apiError);
      return new Response(JSON.stringify({ 
        error: apiError instanceof Error ? apiError.message : 'Erro ao processar pagamento',
        details: String(apiError)
      }), {
        status: 500,
        headers: corsHeaders()
      });
    }
  } catch (jsonError) {
    console.error('Erro ao processar JSON:', jsonError);
    return new Response(JSON.stringify({ 
      error: 'Erro ao processar JSON da requisição' 
    }), {
      status: 400,
      headers: corsHeaders()
    });
  }
}

// Criar o servidor
const listener = Deno.listen({ port: SERVER_PORT });
console.log(`Servidor pronto em http://localhost:${SERVER_PORT}/`);

// Função simples para processar uma conexão por vez
async function processConnections() {
  for (;;) {
    try {
      console.log("Aguardando conexão...");
      const conn = await listener.accept();
      console.log("Conexão aceita");
      
      // Processar a conexão
      processHttpConnection(conn);
    } catch (err) {
      console.error("Erro ao aceitar conexão:", err);
      // Pequena pausa antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Processar uma conexão HTTP
async function processHttpConnection(conn: any) {
  try {
    // @ts-ignore - API do Deno 1.44.1
    const httpConn = Deno.serveHttp(conn);
    console.log("Conexão HTTP estabelecida");
    
    // @ts-ignore - API do Deno 1.44.1
    const requestEvent = await httpConn.nextRequest();
    if (requestEvent) {
      console.log("Evento de requisição recebido");
      try {
        const response = await handleRequest(requestEvent.request);
        await requestEvent.respondWith(response);
        console.log("Resposta enviada");
      } catch (error) {
        console.error("Erro ao responder requisição:", error);
        try {
          const errorResponse = new Response(JSON.stringify({ error: "Erro interno" }), {
            status: 500,
            headers: corsHeaders()
          });
          await requestEvent.respondWith(errorResponse);
        } catch (respondError) {
          console.error("Erro ao enviar resposta de erro:", respondError);
        }
      }
    } else {
      console.log("Nenhum evento de requisição recebido");
    }
  } catch (error) {
    console.error("Erro ao processar conexão HTTP:", error);
  } finally {
    try {
      conn.close();
    } catch (e) {
      // Ignorar erro ao fechar conexão
    }
  }
}

// Iniciar o processamento de conexões
processConnections();

console.log("Servidor em execução. Pressione Ctrl+C para encerrar.");
