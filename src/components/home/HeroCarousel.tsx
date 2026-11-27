'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { HeroPhoto } from '@/data/hero-photos';

const INTERVAL_MS = 6000;

/**
 * Fotos do fundo do topo, trocando sozinhas com fusão suave e um zoom lento na foto
 * da vez. Os pontos embaixo trocam de foto à mão. Com "reduzir movimento" ligado no
 * sistema, não troca sozinho nem dá zoom.
 */
export function HeroCarousel({ photos, grayscale = false }: { photos: HeroPhoto[]; grayscale?: boolean }) {
  // `previous` fica visível por baixo enquanto a foto nova aparece por cima (fusão sem escurecer no meio).
  const [{ current, previous }, setSlides] = useState({ current: 0, previous: -1 });
  const [paused, setPaused] = useState(false);
  const go = (next: number) => setSlides((s) => (next === s.current ? s : { current: next, previous: s.current }));

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPaused(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (paused || photos.length < 2) return;
    const id = window.setTimeout(
      () => setSlides((s) => ({ current: (s.current + 1) % photos.length, previous: s.current })),
      INTERVAL_MS,
    );
    return () => window.clearTimeout(id);
  }, [current, paused, photos.length]);

  return (
    <>
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
        {photos.map((photo, i) => (
          <Image
            key={photo.src.src}
            src={photo.src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectPosition: photo.position }}
            className={`object-cover motion-reduce:scale-100 motion-reduce:transition-none ${grayscale ? 'grayscale' : ''} ${
              i === current
                ? // Aparece por cima com fusão lenta e segue num zoom bem suave até a próxima troca.
                  'z-10 scale-[1.1] opacity-100 transition-[opacity,scale] [transition-duration:1800ms,9000ms] [transition-timing-function:ease-in-out,linear]'
                : i === previous
                  ? // Continua embaixo, no mesmo zoom suave, enquanto a nova cobre.
                    'z-0 scale-[1.1] opacity-100 transition-[opacity,scale] [transition-duration:1800ms,9000ms] [transition-timing-function:ease-in-out,linear]'
                  : 'z-0 scale-100 opacity-0'
            }`}
          />
        ))}
      </div>
      {photos.length > 1 && (
        <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-2 sm:bottom-10">
          {photos.map((photo, i) => (
            <button
              key={photo.src.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Foto ${i + 1} de ${photos.length}: ${photo.alt}`}
              aria-current={i === current}
              className="group flex h-6 items-center"
            >
              <span
                className={`block h-1 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-gb-red' : 'w-4 bg-gb-white/40 group-hover:bg-gb-white/70'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
