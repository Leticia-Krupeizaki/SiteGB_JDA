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

/** Card ampliado no computador: abre para dentro da linha, sem sair da página nas pontas. */
function panelPosition(i: number, total: number) {
  if (i < 2) return 'lg:left-0 lg:origin-top-left';
  if (i > total - 3) return 'lg:right-0 lg:origin-top-right';
  return 'lg:left-1/2 lg:-translate-x-1/2 lg:origin-top';
}

/** Trechos entre **asteriscos duplos** no texto do cliente viram negrito. */
function Strong({ text }: { text: string }) {
  return text.split('**').map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-semibold text-gb-white">{part}</strong> : part));
}

/**
 * Linha do tempo do Legado: foto e nome de cada mestre. No computador, com o mouse
 * sobre a foto o card se amplia num painel com a história completa; tirou o mouse,
 * fecha (CSS: `hover:` só vale em telas com mouse). No celular, o toque abre a
 * história abaixo da foto e outro toque fecha; abrir um card fecha o anterior.
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
    <ol className={`mt-10 lg:mx-0 lg:mb-28 lg:flex-row lg:overflow-visible lg:px-0 lg:pb-0 ${css.list}`}>
      {masters.map((master, i) => {
        const isOpen = revealed === i;
        const last = i === masters.length - 1;
        const storyId = `legado-historia-${master.id}`;
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

            <div className="group/card relative">
              <button
                type="button"
                onPointerDown={(event) => (pointer.current = event.pointerType)}
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={storyId}
                data-open={isOpen}
                className="group focus-ring block w-full text-left"
              >
                <span className={`relative block overflow-hidden ${css.photo}`}>
                  {master.photo ? (
                    <SitePhoto
                      image={master.photo}
                      sizes="(min-width: 1024px) 220px, (min-width: 640px) 40vw, 80vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-data-[open=true]:scale-105"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center border border-gb-white/20 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_10px)] text-xs font-semibold uppercase tracking-wide text-gb-line">
                      Retrato a definir
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-gb-ink/85 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gb-white">
                    <span aria-hidden className="text-gb-red">{isOpen ? '−' : '+'}</span> {isOpen ? 'Fechar história' : 'Conheça sua história'}
                  </span>
                </span>
                <span className="mt-4 block font-display text-2xl leading-tight font-bold uppercase text-gb-white">{master.name}</span>
                <span className="mt-1 block text-sm leading-snug text-gb-line">{master.subtitle}</span>
              </button>

              {/*
                História completa. Celular: abre abaixo da foto ao tocar. Computador: card
                ampliado por cima da linha, com foto e texto, enquanto o mouse estiver nele.
              */}
              <div
                id={storyId}
                className={`${isOpen ? 'block' : 'hidden'} mt-5 border-l-4 border-gb-red pl-4 lg:pointer-events-none lg:absolute lg:top-0 lg:z-30 lg:mt-0 lg:grid lg:w-[52rem] lg:grid-cols-[12rem_1fr] lg:gap-7 lg:border lg:border-gb-white/15 lg:bg-gb-ink lg:p-6 lg:opacity-0 lg:shadow-[0_30px_80px_rgb(0_0_0/0.75)] lg:transition lg:duration-300 lg:ease-out lg:scale-95 lg:group-hover/card:pointer-events-auto lg:group-hover/card:scale-100 lg:group-hover/card:opacity-100 lg:group-has-[:focus-visible]/card:pointer-events-auto lg:group-has-[:focus-visible]/card:scale-100 lg:group-has-[:focus-visible]/card:opacity-100 ${panelPosition(i, masters.length)}`}
              >
                {master.photo && (
                  <div className="hidden lg:block">
                    <SitePhoto image={master.photo} sizes="192px" className="aspect-[3/4] h-auto w-full object-cover" />
                    <p className="mt-4 font-display text-2xl leading-tight font-bold uppercase text-gb-white">{master.name}</p>
                    <p className="mt-1 text-sm text-gb-line">{master.subtitle}</p>
                  </div>
                )}
                <div>
                  <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-gb-red">0{i + 1} · {master.name}</p>
                  <h4 className="mt-2 font-display text-2xl leading-tight font-bold uppercase text-gb-white text-balance lg:text-3xl">{master.headline}</h4>
                  <div className="mt-4 space-y-3 leading-relaxed text-gb-line lg:text-[0.95rem]">
                    {master.story.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)}>
                        <Strong text={paragraph} />
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
