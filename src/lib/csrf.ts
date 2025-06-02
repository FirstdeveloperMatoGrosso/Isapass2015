import { randomBytes, createHmac } from 'crypto';

// Gerar token CSRF
export function generateCsrfToken(): string {
  const random = randomBytes(32).toString('hex');
  const timestamp = Date.now().toString();
  const data = `${random}${timestamp}`;
  
  const hmac = createHmac('sha256', process.env.CSRF_SECRET || 'your-strong-secret-key');
  hmac.update(data);
  const hash = hmac.digest('hex');
  
  return `${data}.${hash}`;
}

// Verificar token CSRF
export function verifyCsrfToken(token: string): boolean {
  try {
    const [data, hash] = token.split('.');
    if (!data || !hash) return false;
    
    // Verificar se o token não expirou (1 hora)
    const timestamp = parseInt(data.slice(64));
    if (Date.now() - timestamp > 3600000) return false;
    
    const hmac = createHmac('sha256', process.env.CSRF_SECRET || 'your-strong-secret-key');
    hmac.update(data);
    const expectedHash = hmac.digest('hex');
    
    return hash === expectedHash;
  } catch {
    return false;
  }
}
