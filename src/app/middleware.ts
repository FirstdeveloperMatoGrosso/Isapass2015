import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting usando objeto simples
const rateLimits: Record<string, { count: number; timestamp: number }> = {}
const WINDOW_MS = 10000 // 10 segundos
const MAX_REQUESTS = 10

function isRateLimited(requestId: string): boolean {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  
  // Limpar entradas antigas
  for (const key in rateLimits) {
    if (rateLimits[key].timestamp < windowStart) {
      delete rateLimits[key]
    }
  }
  
  const current = rateLimits[requestId]
  if (!current) {
    rateLimits[requestId] = { count: 1, timestamp: now }
    return false
  }
  
  if (current.timestamp < windowStart) {
    rateLimits[requestId] = { count: 1, timestamp: now }
    return false
  }
  
  if (current.count >= MAX_REQUESTS) {
    return true
  }
  
  current.count++
  return false
}

export function middleware(request: NextRequest) {
  const requestId = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
  const pathname = request.nextUrl.pathname

  // Aplicar rate limiting em rotas sensíveis
  if (pathname.startsWith('/api/') || pathname.startsWith('/admin/')) {
    if (isRateLimited(requestId)) {
      return new NextResponse('Muitas requisições, tente novamente mais tarde', {
        status: 429,
        headers: {
          'Retry-After': '10',
        },
      })
    }
  }

  // Adicionar headers de segurança
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets/).*)',
  ],
}
