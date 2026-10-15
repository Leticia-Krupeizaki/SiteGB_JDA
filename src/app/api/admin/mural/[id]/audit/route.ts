import { NextResponse, type NextRequest } from 'next/server';
import { handleAdminError, isUuid, parseJson } from '@/lib/api/admin';
import { apiError } from '@/lib/api/errors';
import { requireAdminApi } from '@/lib/auth/guard';
import { addNote, getAuditTrail } from '@/lib/mural/admin';
import { noteSchema } from '@/lib/validation/admin';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

/** Histórico de moderação da foto, do envio até hoje. */
export async function GET(request: NextRequest, { params }: Params) {
  const { error } = await requireAdminApi(request);
  if (error) return error;
  const { id } = await params;
  if (!isUuid(id)) return apiError(404, 'NOT_FOUND', 'Foto não encontrada.');

  try {
    return NextResponse.json({ items: await getAuditTrail(id) });
  } catch (err) {
    return handleAdminError('GET /api/admin/mural/:id/audit', err);
  }
}

/** Observação interna da equipe, registrada no histórico. */
export async function POST(request: NextRequest, { params }: Params) {
  const { session, error } = await requireAdminApi(request);
  if (error) return error;
  const { id } = await params;
  if (!isUuid(id)) return apiError(404, 'NOT_FOUND', 'Foto não encontrada.');
  const body = await parseJson(request, noteSchema);
  if (body.error) return body.error;

  try {
    await addNote(id, body.data.note, session.admin.id);
    return NextResponse.json({ items: await getAuditTrail(id) }, { status: 201 });
  } catch (err) {
    return handleAdminError('POST /api/admin/mural/:id/audit', err);
  }
}
