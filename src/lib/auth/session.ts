import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import type { AdminRole } from '@/generated/prisma/client';
import { db } from '@/lib/db/client';

/**
 * Sessões do painel guardadas no banco: podem ser revogadas a qualquer momento
 * (logout, conta desativada). O cookie leva só um token aleatório; o banco guarda o hash.
 */
const secure = process.env.NODE_ENV === 'production';
/** Em produção, o prefixo __Host- obriga Secure, Path=/ e nenhum Domain. */
export const sessionCookieName = secure ? '__Host-gb_admin' : 'gb_admin';

const sessionMaxAgeMs = 12 * 60 * 60 * 1000;
/** Só regrava "visto por último" de tempos em tempos, para não escrever a cada requisição. */
const touchIntervalMs = 5 * 60 * 1000;

export type AdminUser = { id: string; email: string; name: string | null; role: AdminRole };
export type AdminSessionInfo = { sessionId: string; admin: AdminUser };

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export async function createSession(adminId: string): Promise<void> {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + sessionMaxAgeMs);
  await db().adminSession.create({ data: { adminId, tokenHash: hashToken(token), expiresAt } });
  (await cookies()).set(sessionCookieName, token, { httpOnly: true, secure, sameSite: 'lax', path: '/', expires: expiresAt });
}

/** Sessão válida atual, ou null. Confere expiração, revogação e conta ativa. */
export async function getSession(): Promise<AdminSessionInfo | null> {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) return null;

  const session = await db().adminSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { admin: { select: { id: true, email: true, name: true, role: true, disabledAt: true } } },
  });
  const now = Date.now();
  if (!session || session.revokedAt || session.expiresAt.getTime() <= now || session.admin.disabledAt) return null;

  if (now - session.lastSeenAt.getTime() > touchIntervalMs) {
    await db().adminSession.update({ where: { id: session.id }, data: { lastSeenAt: new Date(now) } });
  }
  const { id, email, name, role } = session.admin;
  return { sessionId: session.id, admin: { id, email, name, role } };
}

export async function destroySession(sessionId?: string): Promise<void> {
  if (sessionId) await db().adminSession.update({ where: { id: sessionId }, data: { revokedAt: new Date() } });
  (await cookies()).delete(sessionCookieName);
}

/** Revoga todas as sessões de um admin (troca de senha, desativação). */
export async function revokeAllSessions(adminId: string): Promise<void> {
  await db().adminSession.updateMany({ where: { adminId, revokedAt: null }, data: { revokedAt: new Date() } });
}
