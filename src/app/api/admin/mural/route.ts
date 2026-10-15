import { NextResponse, type NextRequest } from 'next/server';
import type { MuralCategory } from '@/generated/prisma/client';
import { handleAdminError } from '@/lib/api/admin';
import { apiError } from '@/lib/api/errors';
import { requireAdminApi } from '@/lib/auth/guard';
import { listAdminPosts } from '@/lib/mural/admin';
import { adminListQuerySchema } from '@/lib/validation/admin';
import { fieldErrorsFrom } from '@/lib/validation/mural';

export const runtime = 'nodejs';

/** Todas as fotos, com filtros por status, categoria e período. */
export async function GET(request: NextRequest) {
  const { error } = await requireAdminApi(request);
  if (error) return error;

  const query = adminListQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!query.success) return apiError(400, 'INVALID_QUERY', 'Filtros inválidos.', fieldErrorsFrom(query.error));

  try {
    return NextResponse.json(await listAdminPosts({ ...query.data, category: query.data.category as MuralCategory | undefined }));
  } catch (err) {
    return handleAdminError('GET /api/admin/mural', err);
  }
}
