'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { categoryLabel, muralCategories } from '@/data/mural';
import type { MuralStatus } from '@/types/mural';
import { adminFetch } from './api';
import { formatDateTime, statusTabs } from './labels';
import { PostDetail } from './PostDetail';
import { StatusBadge } from './StatusBadge';
import type { AdminPost, AdminPostPage } from './types';

type Filters = { category: string; from: string; to: string };

const fieldClass = 'focus-ring mt-1 block min-h-11 w-full border-2 border-gb-line bg-gb-white px-3';

/** Fila de moderação: abas por status, filtros por categoria e período. */
export function ModerationBoard({ initialPostId }: { initialPostId?: string }) {
  const [status, setStatus] = useState<MuralStatus>('PENDING');
  const [filters, setFilters] = useState<Filters>({ category: '', from: '', to: '' });
  const [items, setItems] = useState<AdminPost[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [counts, setCounts] = useState<AdminPostPage['counts']>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(initialPostId ?? null);
  const request = useRef(0);

  const load = useCallback(async (next: { status: MuralStatus; filters: Filters; after?: string | null }) => {
    const id = ++request.current;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ status: next.status });
    for (const [key, value] of Object.entries(next.filters)) if (value) params.set(key, value);
    if (next.after) params.set('cursor', next.after);
    try {
      const page = await adminFetch<AdminPostPage>(`/api/admin/mural?${params}`);
      if (id !== request.current) return;
      setItems((current) => (next.after ? [...current, ...page.items] : page.items));
      setCursor(page.nextCursor);
      setCounts(page.counts);
    } catch (err) {
      if (id === request.current) setError(err instanceof Error ? err.message : 'Não foi possível carregar.');
    } finally {
      if (id === request.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load({ status, filters });
  }, [status, filters, load]);

  /** Depois de uma ação, a foto sai da aba atual se mudou de status. */
  const onChanged = (post: AdminPost) => {
    setItems((current) => (post.status === status ? current.map((p) => (p.id === post.id ? post : p)) : current.filter((p) => p.id !== post.id)));
    void adminFetch<AdminPostPage>(`/api/admin/mural?status=${status}&limit=1`).then((page) => setCounts(page.counts)).catch(() => undefined);
  };

  const filtered = filters.category || filters.from || filters.to;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-bold uppercase">Fotos do mural</h1>

      <div role="tablist" aria-label="Status" className="flex flex-wrap gap-1 border-b-2 border-gb-ink">
        {statusTabs.map((tab) => {
          const active = tab.id === status;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStatus(tab.id)}
              className={`focus-ring min-h-11 px-4 font-display text-lg font-semibold uppercase ${active ? 'bg-gb-ink text-gb-white' : 'bg-gb-white text-gb-ink hover:bg-gb-line'}`}
            >
              {tab.label} <span className="tabular-nums opacity-80">({counts[tab.id] ?? 0})</span>
            </button>
          );
        })}
      </div>

      <fieldset className="grid gap-3 bg-gb-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
        <legend className="sr-only">Filtros</legend>
        <label className="text-sm font-semibold">
          Categoria
          <select value={filters.category} onChange={(event) => setFilters((f) => ({ ...f, category: event.target.value }))} className={fieldClass}>
            <option value="">Todas</option>
            {muralCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Enviadas a partir de
          <input type="date" value={filters.from} onChange={(event) => setFilters((f) => ({ ...f, from: event.target.value }))} className={fieldClass} />
        </label>
        <label className="text-sm font-semibold">
          Até
          <input type="date" value={filters.to} onChange={(event) => setFilters((f) => ({ ...f, to: event.target.value }))} className={fieldClass} />
        </label>
        <button
          type="button"
          disabled={!filtered}
          onClick={() => setFilters({ category: '', from: '', to: '' })}
          className="focus-ring min-h-11 px-3 font-semibold text-gb-navy underline disabled:opacity-40"
        >
          Limpar filtros
        </button>
      </fieldset>

      <div role="tabpanel" aria-busy={loading}>
        {error && (
          <p role="alert" className="font-semibold text-gb-red">
            {error}
          </p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="border border-dashed border-gb-mute/40 bg-gb-white p-8 text-center text-gb-mute">Nenhuma foto {filtered ? 'com estes filtros' : 'neste status'}.</p>
        )}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((post) => (
            <li key={post.id}>
              <button type="button" onClick={() => setSelected(post.id)} className="focus-ring block w-full bg-gb-white text-left hover:outline hover:outline-2 hover:outline-gb-ink">
                <div className="aspect-[4/3] overflow-hidden bg-gb-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element -- URL assinada temporária do bucket privado */}
                  <img src={post.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="space-y-1 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-lg font-bold uppercase">{categoryLabel[post.category]}</span>
                    <StatusBadge status={post.status} />
                  </div>
                  <p className="truncate text-sm">{post.studentName}</p>
                  <p className="text-sm text-gb-mute">{formatDateTime(post.createdAt)}</p>
                  {post.openRemovalRequests > 0 && <p className="text-sm font-semibold text-gb-red">Pedido de retirada em aberto</p>}
                </div>
                <span className="sr-only">Abrir detalhe</span>
              </button>
            </li>
          ))}
        </ul>
        {cursor && (
          <div className="mt-6 text-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => void load({ status, filters, after: cursor })}
              className="focus-ring min-h-11 border-2 border-gb-ink bg-gb-white px-6 font-display text-lg font-semibold uppercase disabled:opacity-60"
            >
              {loading ? 'Carregando…' : 'Carregar mais'}
            </button>
          </div>
        )}
      </div>

      <PostDetail postId={selected} onClose={() => setSelected(null)} onChanged={onChanged} />
    </div>
  );
}
