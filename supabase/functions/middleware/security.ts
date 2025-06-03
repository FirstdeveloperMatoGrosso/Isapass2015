import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

// Cache de rate limit por IP
const rateLimitCache = new Map<string, RateLimitEntry>();

// Cache de tokens inválidos para evitar reuso
const invalidTokenCache = new Set<string>();

export async function securityMiddleware(req: Request): Promise<Response | null> {
  // Logging básico
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: new URL(req.url).pathname,
    requestId: crypto.randomUUID()
  }));

  return null; // Continua para o próximo middleware/handler
}

// Validações de dados
export function validateCustomerData(customer: any): string | null {
  // Validação de CPF
  if (!/^\d{11}$/.test(customer.document)) {
    return "CPF inválido";
  }

  // Validação de email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    return "Email inválido";
  }

  // Validação de telefone
  if (!/^\d{10,11}$/.test(customer.phone)) {
    return "Telefone inválido";
  }

  // Validação de nome
  if (!/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(customer.name)) {
    return "Nome inválido";
  }

  return null;
}

// Validações anti-fraude
export function fraudCheck(req: Request, customer: any): { risk: number; reasons: string[] } {
  const reasons: string[] = [];
  let riskScore = 0;

  // 1. Verificação de IP
  const clientIP = req.headers.get("x-forwarded-for") || "unknown";
  if (clientIP === "unknown") {
    riskScore += 30;
    reasons.push("IP suspeito");
  }

  // 2. Múltiplos pedidos do mesmo CPF
  const cpfRequests = rateLimitCache.get(customer.document)?.count || 0;
  if (cpfRequests > 3) {
    riskScore += 20;
    reasons.push("Múltiplos pedidos do mesmo CPF");
  }

  // 3. Verificação de horário
  const hour = new Date().getHours();
  if (hour >= 0 && hour <= 5) {
    riskScore += 10;
    reasons.push("Horário suspeito");
  }

  // 4. Verificação de valor
  if (customer.amount > 100000) { // R$ 1.000,00
    riskScore += 15;
    reasons.push("Valor alto");
  }

  // 5. Verificação de dispositivo
  const userAgent = req.headers.get("user-agent") || "unknown";
  if (!userAgent || userAgent === "unknown" || userAgent.length < 10) {
    riskScore += 25;
    reasons.push("Dispositivo suspeito");
  }

  return { risk: riskScore, reasons };
}

// Headers de segurança
export const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};
