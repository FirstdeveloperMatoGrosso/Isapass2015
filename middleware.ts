import { Request, Response, NextFunction } from 'express';

// Lista de IPs bloqueados
const BLOCKED_IPS: Record<string, boolean> = {
  // Adicione IPs maliciosos aqui
};

// Rate limiting usando objeto simples
const rateLimits: Record<string, { count: number; timestamp: number }> = {};
const WINDOW_MS = 10000; // 10 segundos
const MAX_REQUESTS = 10;

function isRateLimited(requestId: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  
  // Limpar entradas antigas
  for (const key in rateLimits) {
    if (rateLimits[key].timestamp < windowStart) {
      delete rateLimits[key];
    }
  }
  
  const current = rateLimits[requestId];
  if (!current) {
    rateLimits[requestId] = { count: 1, timestamp: now };
    return false;
  }
  
  if (current.timestamp < windowStart) {
    rateLimits[requestId] = { count: 1, timestamp: now };
    return false;
  }
  
  if (current.count >= MAX_REQUESTS) {
    return true;
  }
  
  current.count++;
  return false;
}

export function middleware(req: Request, res: Response, next: NextFunction) {
  const requestId = req.ip || req.headers['x-forwarded-for'] as string || '127.0.0.1';

  // Bloquear IPs maliciosos
  if (BLOCKED_IPS[requestId]) {
    return res.status(403).send('Acesso negado');
  }

  // Aplicar rate limiting em rotas sensíveis
  if (req.path.startsWith('/api/') || req.path.startsWith('/admin/')) {
    if (isRateLimited(requestId)) {
      return res.status(429)
        .set('Retry-After', '10')
        .send('Muitas requisições, tente novamente mais tarde');
    }
  }

  // Adicionar headers de segurança
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  next();
}
