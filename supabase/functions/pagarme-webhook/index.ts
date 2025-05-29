
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAGARME-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("=== WEBHOOK RECEBIDO ===");
    
    const webhookData = await req.json();
    logStep("Dados do webhook", webhookData);

    // Verificar se é um evento de pagamento
    if (webhookData.type === "charge.paid" || webhookData.type === "order.paid") {
      const chargeData = webhookData.data;
      logStep("Pagamento confirmado", { 
        chargeId: chargeData.id,
        orderId: chargeData.order?.id,
        status: chargeData.status
      });

      // Aqui você pode:
      // 1. Atualizar o status do pedido no seu banco de dados
      // 2. Gerar o ingresso automaticamente
      // 3. Enviar email/notificação para o cliente
      
      // Por enquanto, vamos apenas logar os dados importantes
      const paymentInfo = {
        orderId: chargeData.order?.id,
        chargeId: chargeData.id,
        amount: chargeData.amount,
        status: chargeData.status,
        paymentMethod: chargeData.payment_method,
        customerEmail: chargeData.customer?.email,
        metadata: chargeData.metadata
      };
      
      logStep("✅ Pagamento processado automaticamente", paymentInfo);

      // Resposta de sucesso para o Pagar.me
      return new Response(JSON.stringify({ 
        success: true,
        message: "Webhook processado com sucesso"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Para outros tipos de evento
    logStep("Evento não processado", { type: webhookData.type });
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Evento recebido mas não processado"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("❌ ERRO no webhook", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
