import type { NextRequest, NextResponse } from 'next/server';
import { z, type ZodTypeAny } from 'zod';
import { ContentError } from '@/lib/content/cache';
import { ImageRejectedError } from '@/lib/mural/image';
import { ModerationError } from '@/lib/mural/moderation';
import { fieldErrorsFrom } from '@/lib/validation/mural';
import { apiError, logServerError } from './errors';

const statusByCode: Record<ModerationError['code'], number> = {
  NOT_FOUND: 404,
  INVALID_TRANSITION: 409,
  CONFLICT: 409,
  AUTHORIZATION_REQUIRED: 422,
  REASON_REQUIRED: 422,
};

/**
 * Erro de regra (moderação, conteúdo, imagem recusada) vira resposta com o código
 * certo; o resto vira 500 sem detalhes. `fileField`: campo do arquivo no formulário.
 */
export function handleAdminError(context: string, error: unknown, fileField = 'photo'): NextResponse {
  if (error instanceof ModerationError) return apiError(statusByCode[error.code], error.code, error.message);
  if (error instanceof ContentError) return apiError(error.status, error.code, error.message, error.fieldErrors);
  if (error instanceof ImageRejectedError) return apiError(422, 'INVALID_IMAGE', error.message, { [fileField]: error.message });
  logServerError(context, error);
  return apiError(500, 'INTERNAL', 'Algo deu errado. Tente de novo.');
}

/** Lê e valida o corpo JSON. Corpo vazio conta como `{}`. */
export async function parseJson<S extends ZodTypeAny>(request: NextRequest, schema: S): Promise<{ data: z.infer<S>; error?: never } | { data?: never; error: NextResponse }> {
  let body: unknown = {};
  const text = await request.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      return { error: apiError(400, 'INVALID_BODY', 'Envie os dados em JSON.') };
    }
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return { error: apiError(422, 'VALIDATION_ERROR', 'Confira os campos destacados.', fieldErrorsFrom(parsed.error)) };
  return { data: parsed.data };
}

/**
 * Lê um formulário multipart com arquivo, recusando antes de ler o corpo se o
 * tamanho declarado passar do limite. Arquivo ausente ou vazio vira `null`.
 */
export async function parseMultipart(
  request: NextRequest,
  fileField: string,
  maxRequestBytes: number,
): Promise<{ form: FormData; file: Uint8Array | null; error?: never } | { form?: never; file?: never; error: NextResponse }> {
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data')) {
    return { error: apiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Envie o formulário como multipart/form-data.') };
  }
  const length = Number(request.headers.get('content-length'));
  if (!length) return { error: apiError(411, 'LENGTH_REQUIRED', 'Tamanho da requisição não informado.') };
  const tooLarge = `O arquivo deve ter no máximo ${Math.floor(maxRequestBytes / 1024 / 1024)} MB.`;
  if (length > maxRequestBytes) return { error: apiError(413, 'PAYLOAD_TOO_LARGE', tooLarge, { [fileField]: tooLarge }) };

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return { error: apiError(400, 'INVALID_BODY', 'Não foi possível ler o formulário.') };
  }
  const value = form.get(fileField);
  const file = value instanceof File && value.size > 0 ? new Uint8Array(await value.arrayBuffer()) : null;
  return { form, file };
}

/** Campos de texto do formulário (arquivos ficam de fora). */
export function formText(form: FormData, ...names: string[]): Record<string, string> {
  return Object.fromEntries(names.map((name) => {
    const value = form.get(name);
    return [name, typeof value === 'string' ? value : ''];
  }));
}

/** IDs de rota precisam ser UUID; qualquer outra coisa é 404 sem consultar o banco. */
export const isUuid = (value: string) => z.string().uuid().safeParse(value).success;
