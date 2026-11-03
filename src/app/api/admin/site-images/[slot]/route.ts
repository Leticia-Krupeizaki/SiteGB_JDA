import { NextResponse, type NextRequest } from 'next/server';
import { formText, handleAdminError, parseMultipart } from '@/lib/api/admin';
import { apiError } from '@/lib/api/errors';
import { contentRoles, requireAdminApi } from '@/lib/auth/guard';
import { contentLimits } from '@/lib/content/image';
import { resetSiteImage, saveSiteImage } from '@/lib/content/site-images';
import { siteImageFormSchema } from '@/lib/validation/admin';
import { fieldErrorsFrom } from '@/lib/validation/mural';

export const runtime = 'nodejs';

type Context = { params: Promise<{ slot: string }> };

/** Troca a foto de um espaço do site (multipart: `photo`, opcional se já houver foto enviada, e `alt`). */
export async function PUT(request: NextRequest, { params }: Context) {
  const { session, error } = await requireAdminApi(request, contentRoles);
  if (error) return error;
  const { slot } = await params;
  const body = await parseMultipart(request, 'photo', contentLimits.maxRequestBytes);
  if (body.error) return body.error;
  const parsed = siteImageFormSchema.safeParse(formText(body.form, 'alt'));
  if (!parsed.success) return apiError(422, 'VALIDATION_ERROR', 'Confira os campos destacados.', fieldErrorsFrom(parsed.error));

  try {
    await saveSiteImage(slot, { photo: body.file, alt: parsed.data.alt }, session.admin.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleAdminError('PUT /api/admin/site-images/:slot', err);
  }
}

/** Volta à imagem padrão. */
export async function DELETE(request: NextRequest, { params }: Context) {
  const { error } = await requireAdminApi(request, contentRoles);
  if (error) return error;
  const { slot } = await params;
  try {
    await resetSiteImage(slot);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleAdminError('DELETE /api/admin/site-images/:slot', err);
  }
}
