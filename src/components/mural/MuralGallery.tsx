'use client';

import { useState } from 'react';
import { categoryLabel, muralCategories } from '@/data/mural';
import type { MuralCategory, MuralPost } from '@/types/mural';
import { MuralPhoto } from './MuralPhoto';
import { PhotoLightbox } from './PhotoLightbox';

type Filter = MuralCategory | 'TODAS';

/** Galeria do mural com filtro por categoria e foto ampliada. As fotos vêm de src/data/mural.ts. */
export function MuralGallery({ posts: allPosts }: { posts: MuralPost[] }) {
  const [category, setCategory] = useState<Filter>('TODAS');
  const [open, setOpen] = useState<number | null>(null);
  const posts = category === 'TODAS' ? allPosts : allPosts.filter((post) => post.category === category);

  const select = (next: Filter) => {
    setCategory(next);
    setOpen(null);
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
        {`${posts.length} ${posts.length === 1 ? 'foto' : 'fotos'} exibidas.`}
      </div>

      {posts.length > 0 ? (
        <ul className="mt-8 columns-2 gap-3 sm:columns-3 [&>li]:mb-3">
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
        <div className="mt-8 border border-dashed border-gb-mute/40 bg-gb-white p-8 text-center">
          <p className="font-display text-2xl font-bold uppercase">{category === 'TODAS' ? 'O mural ainda está vazio' : 'Nenhuma foto nesta categoria'}</p>
          <p className="mt-2 text-gb-mute">Novas fotos dos treinos, graduações e eventos aparecem aqui em breve.</p>
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
