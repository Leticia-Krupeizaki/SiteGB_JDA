import { NextResponse, type NextRequest } from 'next/server';
import { handleAdminError } from '@/lib/api/admin';
import { apiError } from '@/lib/api/errors';
import { requireAdminApi } from '@/lib/auth/guard';
import { listRemovalRequests } from '@/lib/mural/admin';
import { removalListQuerySchema } from '@/lib/validation/admin';

export const runtime = 'nodejs';

/** Fila de pedidos de retirada. */
export async function GET(request: NextRequest) {
  const { error } = await requireAdminApi(request);
  if (error) return error;
  const query = removalListQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!query.success) return apiError(400, 'INVALID_QUERY', 'Filtro inválido.');

  try {
    return NextResponse.json({ items: await listRemovalRequests(query.data.status) });
  } catch (err) {
    return handleAdminError('GET /api/admin/removal-requests', err);
  }
}
