import { createHmac } from 'node:crypto';
import { db } from '@/lib/db/client';

/**
 * Limite de tentativas por origem, guardado no banco (funciona em serverless
 * sem Redis). O identificador (IP, e-mail) nunca é gravado em claro: vira um HMAC com AUTH_SECRET.
 */
type Window = { limit: number; windowMs: number };

function keyFor(scope: string, identifier: string): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET não configurada.');
  return `${scope}:${createHmac('sha256', secret).update(identifier).digest('hex')}`;
}

export async function isRateLimited(scope: string, identifier: string, { limit, windowMs }: Window): Promise<boolean> {
  const recent = await db().rateLimitHit.count({ where: { key: keyFor(scope, identifier), createdAt: { gte: new Date(Date.now() - windowMs) } } });
  return recent >= limit;
}

export async function recordHit(scope: string, identifier: string): Promise<void> {
  await db().rateLimitHit.create({ data: { key: keyFor(scope, identifier) } });
  // Limpeza ocasional de registros com mais de um dia.
  if (Math.random() < 0.05) {
    await db().rateLimitHit.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } });
  }
}

/** Checa e já registra a tentativa. Retorna false se o limite estourou. */
export async function consumeRateLimit(scope: string, identifier: string, window: Window): Promise<boolean> {
  if (await isRateLimited(scope, identifier, window)) return false;
  await recordHit(scope, identifier);
  return true;
}

/** IP do visitante. Em produção, o proxy da hospedagem (ex.: Vercel) preenche x-forwarded-for. */
export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'desconhecido';
}
