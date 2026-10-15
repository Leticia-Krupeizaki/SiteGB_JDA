import { NextResponse, type NextRequest } from 'next/server';
import { handleAdminError, isUuid, parseJson } from '@/lib/api/admin';
import { apiError } from '@/lib/api/errors';
import { requireAdminApi } from '@/lib/auth/guard';
import { resolveRemovalRequest } from '@/lib/mural/admin';
import { resolveRemovalSchema } from '@/lib/validation/admin';

export const runtime = 'nodejs';

/** Resolve ou descarta um pedido de retirada (opcionalmente removendo a foto vinculada). */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminApi(request);
  if (error) return error;
  const { id } = await params;
  if (!isUuid(id)) return apiError(404, 'NOT_FOUND', 'Pedido não encontrado.');
  const body = await parseJson(request, resolveRemovalSchema);
  if (body.error) return body.error;

  try {
    await resolveRemovalRequest(id, body.data, session.admin.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleAdminError('PATCH /api/admin/removal-requests/:id', err);
  }
}
