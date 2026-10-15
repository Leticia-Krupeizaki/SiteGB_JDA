import { NextResponse, type NextRequest } from 'next/server';
import { parseJson } from '@/lib/api/admin';
import { apiError, logServerError } from '@/lib/api/errors';
import { isSameOrigin } from '@/lib/auth/guard';
import { dummyPasswordHash, verifyPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { db } from '@/lib/db/client';
import { clientIp, isRateLimited, recordHit } from '@/lib/rate-limit';
import { loginSchema } from '@/lib/validation/admin';

export const runtime = 'nodejs';

const window = 15 * 60 * 1000;
const invalid = 'E-mail ou senha incorretos.';

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return apiError(403, 'INVALID_ORIGIN', 'Requisição de origem não permitida.');
  const { data, error } = await parseJson(request, loginSchema);
  if (error) return error;

  try {
    // Só falhas contam. Limite por origem e por conta: trava força bruta distribuída ou concentrada.
    const ip = clientIp(request.headers);
    if ((await isRateLimited('admin-login-ip', ip, { limit: 20, windowMs: window })) || (await isRateLimited('admin-login-email', data.email, { limit: 5, windowMs: window }))) {
      return apiError(429, 'RATE_LIMITED', 'Muitas tentativas. Aguarde 15 minutos e tente de novo.');
    }

    const admin = await db().admin.findUnique({ where: { email: data.email }, select: { id: true, passwordHash: true, disabledAt: true } });
    const valid = await verifyPassword(data.password, admin?.passwordHash ?? (await dummyPasswordHash()));
    if (!admin || !admin.passwordHash || !valid || admin.disabledAt) {
      await Promise.all([recordHit('admin-login-ip', ip), recordHit('admin-login-email', data.email)]);
      return apiError(401, 'INVALID_CREDENTIALS', invalid);
    }

    await createSession(admin.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    logServerError('POST /api/admin/login', err);
    return apiError(500, 'INTERNAL', 'Não foi possível entrar agora.');
  }
}
