import { NextResponse, type NextRequest } from 'next/server';
import { apiError } from '@/lib/api/errors';
import { isSameOrigin } from '@/lib/auth/guard';
import { destroySession, getSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return apiError(403, 'INVALID_ORIGIN', 'Requisição de origem não permitida.');
  const session = await getSession();
  await destroySession(session?.sessionId);
  return NextResponse.json({ ok: true });
}
