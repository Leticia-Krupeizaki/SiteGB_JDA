import { randomUUID } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { muralLimits, muralRateLimits } from '@/data/mural';
import { apiError, logServerError } from '@/lib/api/errors';
import { ImageRejectedError, processUpload } from '@/lib/mural/image';
import { createSubmission, listPublicPosts } from '@/lib/mural/posts';
import { clientIp, consumeRateLimit } from '@/lib/rate-limit';
import { fieldErrorsFrom, muralFormValues, muralSubmissionSchema, publicListQuerySchema } from '@/lib/validation/mural';
import type { MuralCategory } from '@/types/mural';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Galeria pública: só APPROVED e só campos publicáveis. */
export async function GET(request: NextRequest) {
  const query = publicListQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!query.success) return apiError(400, 'INVALID_QUERY', 'Parâmetros de consulta inválidos.', fieldErrorsFrom(query.error));

  try {
    const page = await listPublicPosts({ ...query.data, category: query.data.category as MuralCategory | undefined });
    return NextResponse.json(page, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    logServerError('GET /api/mural', error);
    return apiError(500, 'INTERNAL', 'Não foi possível carregar o mural agora.');
  }
}

/** Envio público. Entra como PENDING e nunca recebe URL pública aqui. */
export async function POST(request: NextRequest) {
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data')) {
    return apiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Envie o formulário como multipart/form-data.');
  }
  const length = Number(request.headers.get('content-length'));
  if (!length) return apiError(411, 'LENGTH_REQUIRED', 'Tamanho da requisição não informado.');
  if (length > muralLimits.maxRequestBytes) {
    return apiError(413, 'PAYLOAD_TOO_LARGE', 'A foto deve ter no máximo 10 MB.', { photo: 'A foto deve ter no máximo 10 MB.' });
  }

  try {
    if (!(await consumeRateLimit('mural-submit', clientIp(request.headers), muralRateLimits.submission))) {
      return apiError(429, 'RATE_LIMITED', 'Muitos envios em pouco tempo. Tente de novo mais tarde.');
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return apiError(400, 'INVALID_BODY', 'Não foi possível ler o formulário.');
    }

    const values = muralFormValues(form);
    // Honeypot preenchido: robô. Responde como sucesso e descarta.
    if (values.website) return NextResponse.json({ id: randomUUID(), status: 'PENDING' }, { status: 201 });

    const parsed = muralSubmissionSchema.safeParse(values);
    const fieldErrors = parsed.success ? {} : fieldErrorsFrom(parsed.error);
    const photo = form.get('photo');
    if (!(photo instanceof File) || photo.size === 0) fieldErrors.photo = 'Escolha uma foto.';
    else if (photo.size > muralLimits.maxFileBytes) fieldErrors.photo = 'A foto deve ter no máximo 10 MB.';
    if (!parsed.success || Object.keys(fieldErrors).length > 0) {
      return apiError(422, 'VALIDATION_ERROR', 'Confira os campos destacados.', fieldErrors);
    }

    let image;
    try {
      image = await processUpload(new Uint8Array(await (photo as File).arrayBuffer()));
    } catch (error) {
      if (error instanceof ImageRejectedError) return apiError(422, 'INVALID_IMAGE', error.message, { photo: error.message });
      throw error;
    }

    const created = await createSubmission(parsed.data, image);
    return NextResponse.json(created, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    logServerError('POST /api/mural', error);
    return apiError(500, 'INTERNAL', 'Não foi possível enviar agora. Tente novamente em alguns minutos.');
  }
}
