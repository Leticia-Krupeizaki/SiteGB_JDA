import type { ApiErrorBody } from '@/lib/api/errors';

/** Erro de API com a mensagem e os erros por campo do servidor. */
export class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fieldErrors: Record<string, string> = {},
  ) {
    super(message);
  }
}

/**
 * fetch do painel: envia JSON (ou FormData, para arquivos), recebe JSON e, se a
 * sessão expirou (401), volta para o login.
 * O navegador manda o cabeçalho Origin sozinho, usado pela proteção CSRF do servidor.
 */
export async function adminFetch<T>(url: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const isForm = init.body instanceof FormData;
  let response: Response;
  try {
    response = await fetch(url, {
      method: init.method ?? 'GET',
      headers: init.body === undefined || isForm ? undefined : { 'Content-Type': 'application/json' },
      body: init.body === undefined ? undefined : isForm ? (init.body as FormData) : JSON.stringify(init.body),
      cache: 'no-store',
    });
  } catch {
    throw new AdminApiError('Sem conexão com o servidor.', 0);
  }

  if (response.status === 401 && !url.endsWith('/login')) {
    window.location.assign('/admin/login');
    throw new AdminApiError('Sessão expirada. Entre de novo.', 401);
  }
  const body = (await response.json().catch(() => null)) as (T & Partial<ApiErrorBody>) | null;
  if (!response.ok) throw new AdminApiError(body?.message ?? 'Algo deu errado.', response.status, body?.fieldErrors);
  return body as T;
}
