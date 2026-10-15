import { createHmac } from 'node:crypto';
import { db } from '@/lib/db/client';

/**
 * Limite de tentativas por origem, guardado no banco (funciona em serverless
 * sem Redis). O IP nunca é gravado em claro: vira um HMAC com AUTH_SECRET.
 */
export async function consumeRateLimit(scope: string, ip: string, { limit, windowMs }: { limit: number; windowMs: number }): Promise<boolean> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET não configurada.');
  const key = `${scope}:${createHmac('sha256', secret).update(ip).digest('hex')}`;
  const now = Date.now();

  const recent = await db().rateLimitHit.count({ where: { key, createdAt: { gte: new Date(now - windowMs) } } });
  if (recent >= limit) return false;

  await db().rateLimitHit.create({ data: { key } });
  // Limpeza ocasional de registros com mais de um dia.
  if (Math.random() < 0.05) {
    await db().rateLimitHit.deleteMany({ where: { createdAt: { lt: new Date(now - 24 * 60 * 60 * 1000) } } });
  }
  return true;
}

/** IP do visitante. Em produção, o proxy da hospedagem (ex.: Vercel) preenche x-forwarded-for. */
export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'desconhecido';
}
