import { NextResponse, type NextRequest } from 'next/server';
import { handleAdminError, isUuid, parseJson } from '@/lib/api/admin';
import { apiError } from '@/lib/api/errors';
import { requireAdminApi } from '@/lib/auth/guard';
import { getAdminPost } from '@/lib/mural/admin';
import { removePost } from '@/lib/mural/moderation';
import { removeSchema } from '@/lib/validation/admin';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

/** Detalhe privado, com a foto por URL assinada temporária. */
export async function GET(request: NextRequest, { params }: Params) {
  const { error } = await requireAdminApi(request);
  if (error) return error;
  const { id } = await params;
  if (!isUuid(id)) return apiError(404, 'NOT_FOUND', 'Foto não encontrada.');

  try {
    const post = await getAdminPost(id);
    return post ? NextResponse.json(post) : apiError(404, 'NOT_FOUND', 'Foto não encontrada.');
  } catch (err) {
    return handleAdminError('GET /api/admin/mural/:id', err);
  }
}

/** Remove do mural e apaga o derivado público. Motivo obrigatório. */
export async function DELETE(request: NextRequest, { params }: Params) {
  const { session, error } = await requireAdminApi(request);
  if (error) return error;
  const { id } = await params;
  if (!isUuid(id)) return apiError(404, 'NOT_FOUND', 'Foto não encontrada.');
  const body = await parseJson(request, removeSchema);
  if (body.error) return body.error;

  try {
    await removePost(id, body.data.reason, { adminId: session.admin.id });
    return NextResponse.json(await getAdminPost(id));
  } catch (err) {
    return handleAdminError('DELETE /api/admin/mural/:id', err);
  }
}
