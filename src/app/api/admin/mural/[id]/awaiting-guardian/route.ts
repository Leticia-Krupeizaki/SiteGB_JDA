import { NextResponse, type NextRequest } from 'next/server';
import { handleAdminError, isUuid, parseJson } from '@/lib/api/admin';
import { apiError } from '@/lib/api/errors';
import { requireAdminApi } from '@/lib/auth/guard';
import { getAdminPost } from '@/lib/mural/admin';
import { markAwaitingGuardian } from '@/lib/mural/moderation';
import { awaitingGuardianSchema } from '@/lib/validation/admin';

export const runtime = 'nodejs';

/** Foto com menor de idade: segura até chegar a autorização dos responsáveis. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminApi(request);
  if (error) return error;
  const { id } = await params;
  if (!isUuid(id)) return apiError(404, 'NOT_FOUND', 'Foto não encontrada.');
  const body = await parseJson(request, awaitingGuardianSchema);
  if (body.error) return body.error;

  try {
    await markAwaitingGuardian(id, { adminId: session.admin.id }, body.data.reason || undefined);
    return NextResponse.json(await getAdminPost(id));
  } catch (err) {
    return handleAdminError('PATCH /api/admin/mural/:id/awaiting-guardian', err);
  }
}
