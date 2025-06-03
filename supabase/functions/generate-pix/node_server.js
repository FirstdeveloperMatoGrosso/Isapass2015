// Servidor HTTP simples usando Node.js
const http = require('http');
const { URL } = require('url');

const port = 8090;
const PAGARME_API_KEY = process.env.PAGARME_API_KEY;

if (!PAGARME_API_KEY) {
  console.error('PAGARME_API_KEY nu00e3o definida');
  process.exit(1);
}

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

async function processRequest(req, res) {
  // Configurar CORS para todas as respostas
  Object.entries(corsHeaders()).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Tratar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Apenas aceitar POST
  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end(JSON.stringify({ error: "Mu00e9todo nu00e3o permitido" }));
    return;
  }

  // Ler o corpo da requisiu00e7u00e3o
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const data = JSON.parse(body);
      console.log("Requisiu00e7u00e3o recebida:", JSON.stringify(data, null, 2));
      
      // Preparar metadados
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const metadata = {
        source: 'isapass',
        integration: 'supabase-pagarme',
        timestamp,
        partner_id: data.event?.partnerId || '',
        event_name: data.event?.name || '',
        event_date: data.event?.date || '',
        event_location: data.event?.location || '',
        ticket_type: data.event?.ticketType || '',
        section: data.event?.section || '',
        row: data.event?.row || '',
        seat: data.event?.seat || '',
        is_half_price: data.event?.isHalfPrice?.toString() || 'false',
        customer_name: data.customer?.name || '',
        customer_document: data.customer?.document || '',
        customer_email: data.customer?.email || '',
        customer_phone: data.customer?.phone || ''
      };
      
      // Preparar payload para o Pagar.me
      const pagarmePayload = {
        items: [
          {
            amount: data.amount || 1000,
            description: `Ingresso ${data.event?.ticketType || 'Standard'} - ${data.event?.name || 'Evento'}`,
            quantity: 1,
            code: 'pix-payment'
          }
        ],
        customer: {
          name: data.customer?.name || 'Cliente Teste',
          email: data.customer?.email || 'cliente@teste.com',
          type: 'individual',
          document: data.customer?.document || '83432616074',
          phones: {
            mobile_phone: {
              country_code: '55',
              area_code: (data.customer?.phone || '11999999999').substring(0, 2),
              number: (data.customer?.phone || '11999999999').substring(2)
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
        console.log('Enviando requisiu00e7u00e3o para o Pagar.me:', JSON.stringify(pagarmePayload, null, 2));
        
        // Fazer requisiu00e7u00e3o para a API do Pagar.me
        const fetch = require('node-fetch');
        const btoa = str => Buffer.from(str).toString('base64');
        
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
        res.writeHead(200);
        res.end(JSON.stringify({
          order_id: pagarmeData.id,
          amount: data.amount,
          status: pagarmeData.status,
          customer: {
            name: data.customer?.name,
            email: data.customer?.email,
            document: data.customer?.document,
            phone: data.customer?.phone
          },
          pix: {
            qr_code: qrCode,
            qr_code_url: qrCodeUrl,
            expires_at: expiresAt
          },
          metadata
        }));
      } catch (apiError) {
        console.error('Erro ao processar pagamento:', apiError);
        res.writeHead(500);
        res.end(JSON.stringify({ 
          error: apiError instanceof Error ? apiError.message : 'Erro ao processar pagamento',
          details: JSON.stringify(apiError)
        }));
      }
    } catch (jsonError) {
      console.error('Erro ao processar JSON:', jsonError);
      res.writeHead(400);
      res.end(JSON.stringify({ 
        error: 'Erro ao processar JSON da requisiu00e7u00e3o' 
      }));
    }
  });
}

// Criar o servidor HTTP
const server = http.createServer(processRequest);

// Iniciar o servidor
server.listen(port, () => {
  console.log(`Servidor HTTP rodando em http://localhost:${port}`);
});

// Tratamento de erros
server.on('error', (err) => {
  console.error('Erro no servidor:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Porta ${port} ju00e1 estu00e1 em uso. Tente outra porta.`);
    process.exit(1);
  }
});

// Tratamento de encerramento gracioso
process.on('SIGINT', () => {
  console.log('Encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado');
    process.exit(0);
  });
});
