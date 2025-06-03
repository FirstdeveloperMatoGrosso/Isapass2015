// Express server para processamento de PIX
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const PORT = 8090;

// Obter chave de API do Pagar.me
const API_KEY = process.env.PAGARME_API_KEY;
if (!API_KEY) {
  console.error('PAGARME_API_KEY não definida');
  process.exit(1);
}

// Middleware para parsing de JSON
app.use(bodyParser.json());

// Middleware para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

// Rota para processamento de pagamentos PIX
app.post('/', async (req, res) => {
  try {
    console.log("Requisição recebida:", JSON.stringify(req.body, null, 2));
    
    const body = req.body;
    
    // Preparar metadados
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const metadata = {
      source: 'isapass',
      integration: 'express-pagarme',
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
            area_code: (body.customer?.phone || '11999999999').substring(0, 2),
            number: (body.customer?.phone || '11999999999').substring(2)
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
          'Authorization': `Basic ${Buffer.from(API_KEY + ':').toString('base64')}`
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
      return res.status(200).json({
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
      });
    } catch (apiError) {
      console.error('Erro ao processar pagamento:', apiError);
      return res.status(500).json({ 
        error: apiError.message || 'Erro ao processar pagamento',
        details: String(apiError)
      });
    }
  } catch (jsonError) {
    console.error('Erro ao processar JSON:', jsonError);
    return res.status(400).json({ 
      error: 'Erro ao processar JSON da requisição' 
    });
  }
});

// Iniciar o servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Tratamento de encerramento gracioso
process.on('SIGINT', () => {
  console.log('Encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado');
    process.exit(0);
  });
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejeição não tratada:', reason);
});
