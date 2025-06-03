// Servidor HTTP simples usando Deno HTTP
// Compatível com Deno versão 1.44.1

// Declaração de tipos para o Deno
declare namespace Deno {
  export function listen(options: { port: number }): any;
  export function serveHttp(conn: any): any;
  export const env: {
    get(key: string): string | undefined;
  };
}

// Configurações
const PAGARME_API_KEY = Deno.env.get('PAGARME_API_KEY');
const SERVER_PORT = 8090;

// Garantir que o módulo seja tratado como módulo
export {};


// Verificar se a chave da API está disponível
if (!PAGARME_API_KEY) {
  console.error('PAGARME_API_KEY não definida');
  console.error('Execute: export PAGARME_API_KEY=sua_chave_api');
  // Usar process.exit como alternativa a Deno.exit que pode não estar disponível
  throw new Error('PAGARME_API_KEY não definida');
}

// A variável listener será declarada mais adiante
console.log(`Servidor HTTP configurado para porta ${SERVER_PORT}`);

// Função para gerar headers CORS
function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

// Função para verificar o status do pagamento no Pagar.me
async function checkPaymentStatus(orderId: string): Promise<Response> {
  try {
    console.log(`Consultando status do pedido ${orderId} no Pagar.me`);
    
    // Fazer requisição para a API do Pagar.me para verificar o status
    const pagarmeResponse = await fetch(`https://api.pagar.me/core/v5/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(PAGARME_API_KEY + ':')}`
      }
    });
    
    if (!pagarmeResponse.ok) {
      const errorData = await pagarmeResponse.json();
      console.error('Erro ao consultar status no Pagar.me:', errorData);
      return new Response(JSON.stringify({ 
        error: "Erro ao consultar status de pagamento",
        details: errorData.message || "Erro desconhecido"
      }), {
        status: pagarmeResponse.status,
        headers: corsHeaders()
      });
    }
    
    const pagarmeData = await pagarmeResponse.json();
    console.log('Resposta de status do Pagar.me:', JSON.stringify(pagarmeData, null, 2));
    
    // Extrair informações relevantes da resposta
    const status = pagarmeData.status;
    const charge = pagarmeData.charges?.[0];
    const chargeStatus = charge?.status;
    const lastTransaction = charge?.last_transaction;
    const transactionStatus = lastTransaction?.status;
    
    // Mapear os status para um formato mais simples para o frontend
    let paymentStatus = "pending";
    
    // Se a ordem ou a transação estão com status de pagamento confirmado
    if (status === "paid" || chargeStatus === "paid" || transactionStatus === "captured") {
      paymentStatus = "paid";
    } 
    // Se a ordem foi cancelada ou falhou
    else if (status === "canceled" || chargeStatus === "canceled" || transactionStatus === "failed") {
      paymentStatus = "failed";
    }
    
    return new Response(JSON.stringify({
      order_id: orderId,
      status: paymentStatus,
      pagarme_status: {
        order: status,
        charge: chargeStatus,
        transaction: transactionStatus
      },
      checked_at: new Date().toISOString()
    }), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    return new Response(JSON.stringify({ 
      error: "Erro ao verificar status do pagamento", 
      details: String(error)
    }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}

// Manipulador de requisições
async function handleRequest(request: Request): Promise<Response> {
  // Tratar CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    });
  }
  
  // Verificar se é uma soliciação de status de pagamento
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  
  // Endpoint para verificar status: /api/payments/status/:order_id
  if (request.method === "GET" && pathParts.length >= 4 && pathParts[1] === "api" && 
      pathParts[2] === "payments" && pathParts[3] === "status" && pathParts[4]) {
    
    const orderId = pathParts[4];
    console.log(`Verificando status do pagamento: ${orderId}`);
    return await checkPaymentStatus(orderId);
  }
  
  // Para as demais rotas, apenas permitir POST
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), {
      status: 405,
      headers: corsHeaders()
    });
  }
  
  try {
    // Processar corpo da requisição
    const body = await request.json();
    console.log("Requisição recebida:", JSON.stringify(body, null, 2));
    
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

// Adicionar export vazio para tornar este arquivo um módulo
export {};

// Montar um servidor HTTP básico que fique rodando em background
console.log(`Iniciando servidor HTTP em http://localhost:${SERVER_PORT}/`);

// Inicializar o servidor básico
const listener = Deno.listen({ port: SERVER_PORT });

// Função para processar cada conexão
function processConnection() {
  (async () => {
    try {
      const conn = await listener.accept();
      console.log("Nova conexão recebida");
      
      // Processar essa conexão e iniciar uma nova escuta imediatamente
      // para não bloquear novas conexões
      setTimeout(processConnection, 0);
      
      try {
        // @ts-ignore - API do Deno 1.44.1
        const httpConn = Deno.serveHttp(conn);
        
        // @ts-ignore - API do Deno 1.44.1
        const requestEvent = await httpConn.nextRequest();
        if (requestEvent) {
          try {
            const response = await handleRequest(requestEvent.request);
            await requestEvent.respondWith(response);
          } catch (error) {
            console.error("Erro ao processar requisição:", error);
            const errorResponse = new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
              status: 500,
              headers: corsHeaders()
            });
            await requestEvent.respondWith(errorResponse);
          }
        }
      } catch (error) {
        console.error("Erro ao processar HTTP:", error);
      }
    } catch (error) {
      console.error("Erro ao aceitar conexão:", error);
      // Se falhar, tentar novamente após um breve intervalo
      setTimeout(processConnection, 1000);
    }
  })();
}

// Iniciar o processamento de conexões
processConnection();

console.log("Servidor rodando e pronto para aceitar requisições");
