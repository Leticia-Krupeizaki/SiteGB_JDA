import { NextResponse, type NextRequest } from 'next/server';
import { formText, handleAdminError, parseMultipart } from '@/lib/api/admin';
import { apiError } from '@/lib/api/errors';
import { contentRoles, requireAdminApi } from '@/lib/auth/guard';
import { resetCurriculum, saveCurriculum } from '@/lib/content/curriculums';
import { contentLimits } from '@/lib/content/image';
import { curriculumFormSchema } from '@/lib/validation/admin';
import { fieldErrorsFrom } from '@/lib/validation/mural';

export const runtime = 'nodejs';

type Context = { params: Promise<{ slug: string }> };

/**
 * Publica a versão nova de um currículo (multipart: `poster` em imagem, `version`
 * e `referenceMonth`). PDF é convertido em imagem no navegador antes do envio.
 */
export async function PUT(request: NextRequest, { params }: Context) {
  const { session, error } = await requireAdminApi(request, contentRoles);
  if (error) return error;
  const { slug } = await params;
  const body = await parseMultipart(request, 'poster', contentLimits.maxRequestBytes);
  if (body.error) return body.error;
  const parsed = curriculumFormSchema.safeParse(formText(body.form, 'version', 'referenceMonth'));
  if (!parsed.success) return apiError(422, 'VALIDATION_ERROR', 'Confira os campos destacados.', fieldErrorsFrom(parsed.error));

  try {
    await saveCurriculum(slug, { poster: body.file, ...parsed.data }, session.admin.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleAdminError('PUT /api/admin/curriculums/:slug', err, 'poster');
  }
}

/** Volta ao pôster padrão. */
export async function DELETE(request: NextRequest, { params }: Context) {
  const { error } = await requireAdminApi(request, contentRoles);
  if (error) return error;
  const { slug } = await params;
  try {
    await resetCurriculum(slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleAdminError('DELETE /api/admin/curriculums/:slug', err);
  }
}
