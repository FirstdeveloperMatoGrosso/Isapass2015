
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PIX-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("=== INÍCIO DA EDGE FUNCTION PIX ===");
    
    const { customerData, total, metadata } = await req.json();
    logStep("=== DADOS RECEBIDOS ===", { customerData, total, metadata });

    const pagarmeApiKey = Deno.env.get("PAGARME_API_KEY");
    if (!pagarmeApiKey) {
      throw new Error("PAGARME_API_KEY não configurada");
    }
    logStep("✅ Chave de API do Pagar.me encontrada");

    // Limpar dados
    const cleanDocument = customerData.document.replace(/\D/g, '');
    const cleanPhone = customerData.phone.replace(/\D/g, '');
    
    logStep("=== DADOS LIMPOS ===", { 
      documentoLimpo: cleanDocument, 
      telefoneLimpo: cleanPhone 
    });

    // Formatar telefone
    const phoneFormatted = {
      country_code: "55",
      area_code: cleanPhone.substring(0, 2),
      number: cleanPhone.substring(2)
    };
    logStep("📞 Telefone formatado", phoneFormatted);

    // Converter valor para centavos
    const amountInCents = Math.round(total * 100);
    logStep("💰 Valor em centavos", amountInCents);

    // URL do webhook para confirmação automática
    const webhookUrl = `${req.headers.get('origin') || 'https://your-app.lovable.app'}/supabase/functions/v1/pagarme-webhook`;

    // Montar payload
    const payload = {
      amount: amountInCents,
      currency: "BRL",
      customer: {
        name: customerData.name,
        email: customerData.email,
        document: cleanDocument,
        type: "individual",
        phones: {
          mobile_phone: phoneFormatted
        }
      },
      items: [
        {
          amount: amountInCents,
          description: `Ingresso - ${metadata.eventTitle || 'Evento'}`,
          quantity: metadata.quantity || 1,
          code: "ticket-payment"
        }
      ],
      payments: [
        {
          payment_method: "pix",
          pix: {
            expires_in: 900 // 15 minutos
          }
        }
      ],
      // Configurar webhook para confirmação automática
      notification_urls: [webhookUrl],
      metadata: {
        source: "drink-token-system",
        integration: "supabase-pagarme",
        timestamp: new Date().toISOString(),
        webhook_url: webhookUrl,
        ...metadata
      }
    };

    logStep("=== PAYLOAD FINAL PARA PAGAR.ME ===", payload);

    // Fazer requisição para Pagar.me
    const apiUrl = "https://api.pagar.me/core/v5/orders";
    logStep("🌐 URL da API", apiUrl);

    const headers = {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Authorization": `Basic ${btoa(pagarmeApiKey + ":")}`
    };

    logStep("📤 Enviando requisição para o Pagar.me...");
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    logStep("📊 Status da resposta", response.status);

    const responseData = await response.json();
    logStep("📄 Resposta do Pagar.me", responseData);

    if (!response.ok) {
      throw new Error(`Erro na API Pagar.me: ${JSON.stringify(responseData)}`);
    }

    // Verificar se houve sucesso
    if (responseData.status === "failed") {
      const errors = responseData.charges?.[0]?.last_transaction?.gateway_response?.errors;
      const errorMessage = errors ? errors.map((e: any) => e.message).join(", ") : "Erro desconhecido";
      throw new Error(`Pagamento falhou: ${errorMessage}`);
    }

    // Extrair dados do PIX
    const charge = responseData.charges?.[0];
    const transaction = charge?.last_transaction;
    
    const result = {
      success: true,
      orderId: responseData.id,
      code: responseData.code,
      status: responseData.status,
      qrCode: transaction?.qr_code,
      qrCodeUrl: transaction?.qr_code_url,
      expiresAt: transaction?.expires_at,
      amount: responseData.amount,
      currency: responseData.currency,
      webhookConfigured: true
    };

    logStep("✅ PIX gerado com sucesso!", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("❌ ERRO", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
