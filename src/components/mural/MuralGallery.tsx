'use client';

import { useRef, useState } from 'react';
import { categoryLabel, muralCategories } from '@/data/mural';
import type { MuralCategory, PublicMuralPage, PublicMuralPost } from '@/types/mural';
import { MuralPhoto } from './MuralPhoto';
import { PhotoLightbox } from './PhotoLightbox';

type Filter = MuralCategory | 'TODAS';

async function fetchPage(category: Filter, cursor?: string | null): Promise<PublicMuralPage> {
  const params = new URLSearchParams();
  if (category !== 'TODAS') params.set('category', category);
  if (cursor) params.set('cursor', cursor);
  const response = await fetch(`/api/mural?${params}`);
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}

/** Galeria das fotos aprovadas. A primeira página vem do servidor; filtros e "Carregar mais" buscam na API. */
export function MuralGallery({ initial }: { initial: PublicMuralPage }) {
  const [category, setCategory] = useState<Filter>('TODAS');
  const [posts, setPosts] = useState<PublicMuralPost[]>(initial.items);
  const [cursor, setCursor] = useState(initial.nextCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const request = useRef(0);

  const load = async (next: Filter, after?: string | null) => {
    const id = ++request.current;
    setLoading(true);
    setError(false);
    try {
      const page = await fetchPage(next, after);
      if (id !== request.current) return; // resposta de um filtro antigo
      setPosts((current) => (after ? [...current, ...page.items] : page.items));
      setCursor(page.nextCursor);
    } catch {
      if (id === request.current) setError(true);
    } finally {
      if (id === request.current) setLoading(false);
    }
  };

  const select = (next: Filter) => {
    if (next === category) return;
    setCategory(next);
    setOpen(null);
    void load(next);
  };

  const options = [{ id: 'TODAS' as const, label: 'Todas' }, ...muralCategories];

  return (
    <div>
      <div role="group" aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
        {options.map((option) => {
          const pressed = option.id === category;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => select(option.id)}
              className={`focus-ring min-h-11 border-2 px-4 font-display text-lg font-semibold uppercase transition-colors ${
                pressed ? 'border-gb-ink bg-gb-ink text-gb-white' : 'border-gb-line bg-gb-white text-gb-ink hover:border-gb-ink'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="sr-only">
        {loading ? 'Carregando fotos…' : `${posts.length} ${posts.length === 1 ? 'foto' : 'fotos'} exibidas.`}
      </div>

      {posts.length > 0 ? (
        <ul className={`mt-8 columns-2 gap-3 sm:columns-3 [&>li]:mb-3 ${loading && !cursor ? 'opacity-60' : ''}`}>
          {posts.map((post, i) => (
            <li key={post.id} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="focus-ring block w-full transition-opacity hover:opacity-90"
                aria-label={`Ampliar foto de ${categoryLabel[post.category]}${post.caption ? `: ${post.caption}` : ''}`}
              >
                <MuralPhoto post={post} sizes="(min-width: 640px) 33vw, 50vw" priority={i < 3} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !loading && (
          <div className="mt-8 border border-dashed border-gb-mute/40 bg-gb-white p-8 text-center">
            <p className="font-display text-2xl font-bold uppercase">
              {category === 'TODAS' ? 'O mural ainda está vazio' : 'Nenhuma foto nesta categoria'}
            </p>
            <p className="mt-2 text-gb-mute">
              Que tal ser o primeiro a enviar?{' '}
              <a href="#enviar" className="focus-ring font-semibold text-gb-navy underline">
                Compartilhar minha foto
              </a>
            </p>
          </div>
        )
      )}

      {error && (
        <p role="alert" className="mt-6 text-center font-semibold text-gb-red">
          Não foi possível carregar as fotos. Verifique sua conexão e tente de novo.
        </p>
      )}

      {cursor && (
        <div className="mt-6 text-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => void load(category, cursor)}
            className="focus-ring min-h-12 border-2 border-gb-ink px-6 font-display text-lg font-semibold uppercase hover:bg-gb-ink hover:text-gb-white disabled:opacity-60"
          >
            {loading ? 'Carregando…' : 'Carregar mais'}
          </button>
        </div>
      )}

      <PhotoLightbox
        post={open === null ? null : (posts[open] ?? null)}
        index={open ?? 0}
        total={posts.length}
        onClose={() => setOpen(null)}
        onNavigate={(delta) => setOpen((i) => (i === null ? i : (i + delta + posts.length) % posts.length))}
      />
    </div>
  );
}
