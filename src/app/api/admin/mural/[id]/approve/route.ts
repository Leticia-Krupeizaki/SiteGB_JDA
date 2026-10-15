import { NextResponse, type NextRequest } from 'next/server';
import { handleAdminError, isUuid, parseJson } from '@/lib/api/admin';
import { apiError } from '@/lib/api/errors';
import { requireAdminApi } from '@/lib/auth/guard';
import { getAdminPost } from '@/lib/mural/admin';
import { approvePost } from '@/lib/mural/moderation';
import { approveSchema } from '@/lib/validation/admin';

export const runtime = 'nodejs';

/** Aprova: exige revisão de direitos e autorização de responsáveis resolvida; gera o derivado público. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireAdminApi(request);
  if (error) return error;
  const { id } = await params;
  if (!isUuid(id)) return apiError(404, 'NOT_FOUND', 'Foto não encontrada.');
  const body = await parseJson(request, approveSchema);
  if (body.error) return body.error;

  try {
    await approvePost(id, body.data, { adminId: session.admin.id });
    return NextResponse.json(await getAdminPost(id));
  } catch (err) {
    return handleAdminError('PATCH /api/admin/mural/:id/approve', err);
  }
}
