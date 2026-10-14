'use client';

import { useMemo, useState } from 'react';
import { categoryLabel, demoMuralPosts, muralCategories, muralLimits } from '@/data/mural';
import type { MuralCategory } from '@/types/mural';
import { DemoPhotoTile } from './DemoPhotoTile';
import { PhotoLightbox } from './PhotoLightbox';

export function MuralGallery() {
  const [category, setCategory] = useState<MuralCategory | 'TODAS'>('TODAS');
  const [visible, setVisible] = useState(muralLimits.pageSize);
  const [open, setOpen] = useState<number | null>(null);

  const posts = useMemo(
    () => (category === 'TODAS' ? demoMuralPosts : demoMuralPosts.filter((p) => p.category === category)),
    [category],
  );
  const shown = posts.slice(0, visible);

  const select = (next: MuralCategory | 'TODAS') => {
    setCategory(next);
    setVisible(muralLimits.pageSize);
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

      {shown.length > 0 ? (
        <ul className="mt-8 columns-2 gap-3 sm:columns-3 [&>li]:mb-3">
          {shown.map((post, i) => (
            <li key={post.id} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="focus-ring block w-full transition-opacity hover:opacity-90"
                aria-label={`Ampliar exemplo de ${categoryLabel[post.category]}`}
              >
                <DemoPhotoTile post={post} index={i} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 border border-dashed border-gb-mute/40 p-8 text-center">
          <p className="font-display text-2xl font-bold uppercase">Nenhuma foto nesta categoria</p>
          <p className="mt-2 text-gb-mute">Que tal ser o primeiro a enviar?</p>
        </div>
      )}

      {visible < posts.length && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + muralLimits.pageSize)}
            className="focus-ring min-h-12 border-2 border-gb-ink px-6 font-display text-lg font-semibold uppercase hover:bg-gb-ink hover:text-gb-white"
          >
            Carregar mais
          </button>
        </div>
      )}

      <PhotoLightbox
        post={open === null ? null : shown[open]}
        index={open ?? 0}
        total={shown.length}
        onClose={() => setOpen(null)}
        onNavigate={(delta) => setOpen((i) => (i === null ? i : (i + delta + shown.length) % shown.length))}
      />
    </div>
  );
}
