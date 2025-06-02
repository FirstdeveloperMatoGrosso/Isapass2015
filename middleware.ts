import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de IPs bloqueados
const BLOCKED_IPS = new Set([
  // Adicione IPs maliciosos aqui
]);

// Rate limiting simples usando Map
const rateLimiter = new Map<string, { count: number; timestamp: number }>();
const WINDOW_MS = 10000; // 10 segundos
const MAX_REQUESTS = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  
  // Limpar entradas antigas
  for (const [key, value] of rateLimiter.entries()) {
    if (value.timestamp < windowStart) {
      rateLimiter.delete(key);
    }
  }
  
  const current = rateLimiter.get(ip);
  if (!current) {
    rateLimiter.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  if (current.timestamp < windowStart) {
    rateLimiter.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  if (current.count >= MAX_REQUESTS) {
    return true;
  }
  
  current.count++;
  return false;
}

export function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const pathname = request.nextUrl.pathname;

  // Bloquear IPs maliciosos
  if (BLOCKED_IPS.has(ip)) {
    return new NextResponse('Acesso negado', { status: 403 });
  }

  // Aplicar rate limiting em rotas sensíveis
  if (pathname.startsWith('/api/') || pathname.startsWith('/admin/')) {
    if (isRateLimited(ip)) {
      return new NextResponse('Muitas requisições, tente novamente mais tarde', {
        status: 429,
        headers: {
          'Retry-After': '10',
        },
      });
    }
  }

  // Adicionar headers de segurança
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  return response;
}
