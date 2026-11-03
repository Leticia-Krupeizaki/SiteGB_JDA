import { revalidateTag, unstable_cache } from 'next/cache';
import { connection } from 'next/server';
import { logServerError } from '@/lib/api/errors';
import { deleteObject } from '@/lib/storage';

/** Tag do cache das trocas feitas pelo painel (fotos e currículos). */
const contentTag = 'site-content';

/**
 * Lê conteúdo editável no painel. A página passa a ser renderizada por requisição
 * (o build não tem banco), mas a consulta fica em cache até a próxima troca.
 * Sem banco ou com erro, usa o padrão do código: o site nunca quebra por isso.
 */
export async function readContent<T>(name: string, load: () => Promise<T>, fallback: T): Promise<T> {
  await connection();
  if (!process.env.DATABASE_URL) return fallback;
  try {
    // Erro não entra no cache: a próxima requisição tenta de novo.
    return await unstable_cache(load, [name], { tags: [contentTag] })();
  } catch (error) {
    logServerError(`conteúdo ${name}`, error);
    return fallback;
  }
}

/** Depois de uma troca no painel: o site mostra a nova versão na próxima visita. */
export function contentChanged() {
  revalidateTag(contentTag);
}

/** Apaga um arquivo antigo do bucket público; falha só fica no log (o banco já não aponta para ele). */
export async function deleteReplaced(key: string) {
  try {
    await deleteObject('public', key);
  } catch (error) {
    logServerError('apagar arquivo substituído', error);
  }
}

/** Erro de regra do painel de conteúdo, com status HTTP e campo afetado. */
export class ContentError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fieldErrors?: Record<string, string>,
  ) {
    super(message);
  }
}
