import { NextResponse } from 'next/server';

/** Formato único de erro das APIs: `{ code, message, fieldErrors? }`. */
export type ApiErrorBody = { code: string; message: string; fieldErrors?: Record<string, string> };

export function apiError(status: number, code: string, message: string, fieldErrors?: Record<string, string>) {
  const body: ApiErrorBody = { code, message, ...(fieldErrors && { fieldErrors }) };
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

/** Registra só o tipo e a mensagem do erro: nunca corpo da requisição, arquivo ou contato. */
export function logServerError(context: string, error: unknown) {
  const detail = error instanceof Error ? `${error.name}: ${error.message}` : 'erro desconhecido';
  console.error(`[${context}] ${detail}`);
}
