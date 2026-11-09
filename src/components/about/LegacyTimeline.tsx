'use client';

import { useRef, useState } from 'react';
import { SitePhoto } from '@/components/ui/SitePhoto';
import type { LegacyMaster } from '@/data/legacy';
import type { SiteImage } from '@/lib/content/site-images';

export type TimelineMaster = Omit<LegacyMaster, 'photo' | 'requiresWrittenAuthorization'> & { photo: SiteImage | null };

/** No celular: faixa que desliza para o lado ou trilho vertical. No computador é sempre horizontal. */
type MobileLayout = 'horizontal' | 'vertical';

const layout = {
  horizontal: {
    list: '-mx-4 flex snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6',
    item: 'w-[72%] shrink-0 snap-start pr-5 last:pr-0 sm:w-[40%]',
    marker: 'mb-5',
    rail: 'hidden',
    photo: 'aspect-[3/4]',
  },
  vertical: {
    list: 'flex flex-col',
    item: 'relative pb-10 pl-9 last:pb-0 lg:pl-0',
    marker: '-ml-9 mb-4 lg:ml-0 lg:mb-5',
    rail: 'absolute top-2 bottom-0 left-[6.5px] w-px bg-gb-white/25 lg:hidden',
    photo: 'aspect-[4/5] lg:aspect-[3/4]',
  },
};

/**
 * Linha do tempo do Legado: foto e nome de cada mestre. Com o mouse sobre a foto, ela
 * amplia e a breve história aparece; tirou o mouse, some (CSS: `hover:` só vale em telas
 * com mouse). No toque, cada toque abre ou fecha, e abrir um card fecha o anterior.
 */
export function LegacyTimeline({ masters, mobile = 'horizontal' }: { masters: TimelineMaster[]; mobile?: MobileLayout }) {
  const [revealed, setRevealed] = useState<number | null>(null);
  const css = layout[mobile];

  // Tipo do ponteiro no início do toque/clique: no Safari do iPhone o próprio clique
  // chega como "mouse", então não dá para ler o tipo nele.
  const pointer = useRef('');

  function toggle(i: number) {
    // Mouse de verdade: quem mostra e esconde é o hover; o clique não deixa aberto.
    const mouse = pointer.current === 'mouse' && window.matchMedia('(hover: hover)').matches;
    pointer.current = '';
    if (!mouse) setRevealed(revealed === i ? null : i);
  }

  return (
    <ol className={`mt-10 lg:mx-0 lg:flex-row lg:overflow-visible lg:px-0 lg:pb-0 ${css.list}`}>
      {masters.map((master, i) => {
        const isOpen = revealed === i;
        const last = i === masters.length - 1;
        return (
          <li key={master.id} className={`group/item lg:w-auto lg:flex-1 lg:pr-5 lg:pb-0 lg:last:pr-0 ${css.item}`}>
            {!last && <span aria-hidden className={css.rail} />}
            <div aria-hidden className={`relative flex items-center gap-3 ${css.marker}`}>
              <span
                className={`h-3.5 w-3.5 shrink-0 rotate-45 border-2 transition-colors group-hover/item:border-gb-red group-hover/item:bg-gb-red ${isOpen ? 'border-gb-red bg-gb-red' : 'border-gb-line bg-gb-ink'}`}
              />
              <span className={`font-display text-lg font-bold transition-colors group-hover/item:text-gb-red ${isOpen ? 'text-gb-red' : 'text-gb-line'}`}>0{i + 1}</span>
              {/* Trilho horizontal: avança sobre o espaçamento até o próximo marco. */}
              {!last && <span className={`-mr-5 h-px flex-1 bg-gb-white/25 ${mobile === 'vertical' ? 'hidden lg:block' : ''}`} />}
            </div>

            <button type="button" onPointerDown={(event) => (pointer.current = event.pointerType)} onClick={() => toggle(i)} aria-expanded={isOpen} data-open={isOpen} className="group focus-ring block w-full text-left">
              <span className={`relative block overflow-hidden ${css.photo}`}>
                {master.photo ? (
                  <SitePhoto
                    image={master.photo}
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 40vw, 80vw"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus-visible:scale-105 group-data-[open=true]:scale-105"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center border border-gb-white/20 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_10px)] text-xs font-semibold uppercase tracking-wide text-gb-line">
                    Retrato a definir
                  </span>
                )}

                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-gb-ink/85 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gb-white transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0 group-data-[open=true]:opacity-0">
                  <span aria-hidden className="text-gb-red">+</span> Conheça sua história
                </span>

                {/* Sobreposição: escurece a foto e sobe o título e a breve história. */}
                <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/85 to-black/55 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[open=true]:opacity-100">
                  <span className="block translate-y-4 transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0 group-data-[open=true]:translate-y-0">
                    <span className="block font-display text-lg leading-tight font-bold uppercase text-gb-white">{master.headline}</span>
                    <span className="mt-2 block border-l-2 border-gb-red pl-3 text-sm leading-snug text-gb-white/90">{master.summary}</span>
                  </span>
                </span>
              </span>

              <span className="mt-4 block font-display text-2xl leading-tight font-bold uppercase text-gb-white">{master.name}</span>
              <span className="mt-1 block text-sm leading-snug text-gb-line">{master.subtitle}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
