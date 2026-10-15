import type { NextRequest, NextResponse } from 'next/server';
import { z, type ZodTypeAny } from 'zod';
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

/** Erro de regra de moderação vira resposta com o código certo; o resto vira 500 sem detalhes. */
export function handleAdminError(context: string, error: unknown): NextResponse {
  if (error instanceof ModerationError) return apiError(statusByCode[error.code], error.code, error.message);
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

/** IDs de rota precisam ser UUID; qualquer outra coisa é 404 sem consultar o banco. */
export const isUuid = (value: string) => z.string().uuid().safeParse(value).success;
