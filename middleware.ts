import { Request, Response, NextFunction } from 'express';
import { Redis } from '@upstash/redis';
import rateLimit from 'express-rate-limit';

// Lista de IPs bloqueados
const BLOCKED_IPS = new Set([
  // Adicione IPs maliciosos aqui
]);

// Rate limiter
const limiter = rateLimit({
  windowMs: 10 * 1000, // 10 segundos
  max: 10, // limite de 10 requisições por janela
  message: 'Muitas requisições, tente novamente mais tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de segurança
export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || '127.0.0.1';

  // Bloquear IPs maliciosos
  if (BLOCKED_IPS.has(ip)) {
    return res.status(403).send('Acesso negado');
  }

  // Aplicar rate limiting em rotas sensíveis
  if (req.path.startsWith('/api/') || req.path.startsWith('/admin/')) {
    return limiter(req, res, next);
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
