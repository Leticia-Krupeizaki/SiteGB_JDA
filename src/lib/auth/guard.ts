import { redirect } from 'next/navigation';
import type { NextRequest, NextResponse } from 'next/server';
import type { AdminRole } from '@/generated/prisma/client';
import { apiError } from '@/lib/api/errors';
import { getSession, type AdminSessionInfo } from './session';

/** Papéis que podem moderar o mural. */
export const moderatorRoles: AdminRole[] = ['ADMIN', 'MODERATOR'];

/**
 * Mutação só vale se vier do próprio site. Junto com o cookie SameSite=Lax,
 * fecha CSRF: outro domínio não consegue enviar Origin igual ao nosso.
 */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const mutating = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Checagem de cada handler de /api/admin, independente do middleware:
 * 401 sem sessão, 403 sem papel, 403 em mutação de outra origem.
 */
export async function requireAdminApi(
  request: NextRequest,
  roles: AdminRole[] = moderatorRoles,
): Promise<{ session: AdminSessionInfo; error?: never } | { session?: never; error: NextResponse }> {
  if (mutating.has(request.method) && !isSameOrigin(request)) {
    return { error: apiError(403, 'INVALID_ORIGIN', 'Requisição de origem não permitida.') };
  }
  const session = await getSession();
  if (!session) return { error: apiError(401, 'UNAUTHENTICATED', 'Faça login para continuar.') };
  if (!roles.includes(session.admin.role)) return { error: apiError(403, 'FORBIDDEN', 'Você não tem permissão para esta ação.') };
  return { session };
}

/** Para páginas do painel: sem sessão válida, volta para o login. */
export async function requireAdminPage(roles: AdminRole[] = moderatorRoles): Promise<AdminSessionInfo> {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  if (!roles.includes(session.admin.role)) redirect('/admin/login?erro=permissao');
  return session;
}
