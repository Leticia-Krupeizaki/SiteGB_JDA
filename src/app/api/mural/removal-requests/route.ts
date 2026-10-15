import { NextResponse, type NextRequest } from 'next/server';
import { muralRateLimits } from '@/data/mural';
import { apiError, logServerError } from '@/lib/api/errors';
import { createRemovalRequest } from '@/lib/mural/posts';
import { clientIp, consumeRateLimit } from '@/lib/rate-limit';
import { fieldErrorsFrom, removalRequestSchema } from '@/lib/validation/mural';

export const runtime = 'nodejs';

/** Pedido de retirada de foto. Aceita JSON. A equipe analisa no painel. */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError(400, 'INVALID_BODY', 'Envie os dados em JSON.');
  }

  const parsed = removalRequestSchema.safeParse(body);
  if (!parsed.success) return apiError(422, 'VALIDATION_ERROR', 'Confira os campos destacados.', fieldErrorsFrom(parsed.error));

  try {
    if (!(await consumeRateLimit('mural-removal', clientIp(request.headers), muralRateLimits.removalRequest))) {
      return apiError(429, 'RATE_LIMITED', 'Muitos pedidos em pouco tempo. Tente de novo mais tarde.');
    }
    const { requesterContact, reason, postId } = parsed.data;
    const created = await createRemovalRequest({ requesterContact, reason, postId: postId || undefined });
    return NextResponse.json({ id: created.id, status: 'OPEN' }, { status: 201 });
  } catch (error) {
    logServerError('POST /api/mural/removal-requests', error);
    return apiError(500, 'INTERNAL', 'Não foi possível registrar o pedido agora.');
  }
}
