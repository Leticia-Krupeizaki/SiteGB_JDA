import { NextResponse, type NextRequest } from 'next/server';

/**
 * Primeira barreira do painel: sem cookie de sessão, nem chega à página ou API.
 * A validação real (sessão no banco, papel) acontece em cada página e handler.
 */
const cookieNames = ['__Host-gb_admin', 'gb_admin'];
const publicPaths = new Set(['/admin/login', '/api/admin/login']);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = cookieNames.some((name) => request.cookies.has(name));

  if (!publicPaths.has(pathname) && !hasSession) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ code: 'UNAUTHENTICATED', message: 'Faça login para continuar.' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
