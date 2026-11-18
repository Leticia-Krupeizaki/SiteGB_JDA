'use client';

import { useEffect, useRef } from 'react';
import { BioContent, Portrait, Quote, useTapToggle, type InstructorCardData } from './shared';

const CARD_H = 'h-[30rem] sm:h-[32rem] lg:h-[35rem]';
/** Painel aberto no computador: 3 colunas de largura, 2rem mais alto que o card em cima e embaixo. */
const PANEL_COLUMNS = 3;
const PANEL_UP = 32;

/**
 * No computador, o painel de cada professor fica guardado "dentro" do próprio card:
 * calculamos onde ele aparece (a partir do card, crescendo para o centro da grade) e o
 * deslocamento/escala que o encolhem até o card (--dx, --dy, --sx, --sy). Aberto, ele
 * perde essa transformação e vem para frente. Recalcula ao redimensionar.
 */
function usePanelOrigins() {
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const cards = [...list.querySelectorAll<HTMLElement>('[data-card]')];
      const gap = cards.length > 1 ? Math.max(0, cards[1].offsetLeft - cards[0].offsetLeft - cards[0].offsetWidth) : 0;
      list.querySelectorAll<HTMLElement>('[data-panel]').forEach((panel) => {
        const card = panel.parentElement?.querySelector<HTMLElement>('[data-card]');
        if (!card) return;
        const width = Math.min(list.clientWidth, card.offsetWidth * PANEL_COLUMNS + gap * (PANEL_COLUMNS - 1));
        // Cresce para o lado de dentro da grade: sempre sobra professor à vista do outro lado.
        const inLeftHalf = card.offsetLeft + card.offsetWidth / 2 < list.clientWidth / 2;
        const anchored = inLeftHalf ? card.offsetLeft : card.offsetLeft + card.offsetWidth - width;
        const left = Math.min(Math.max(anchored, 0), list.clientWidth - width);
        panel.style.setProperty('--panel-top', `${card.offsetTop - PANEL_UP}px`);
        panel.style.setProperty('--panel-left', `${left}px`);
        panel.style.setProperty('--panel-w', `${width}px`);
        if (getComputedStyle(panel).position !== 'absolute') return;
        panel.style.setProperty('--dx', `${card.offsetLeft - left}px`);
        panel.style.setProperty('--dy', `${PANEL_UP}px`);
        panel.style.setProperty('--sx', `${card.offsetWidth / width}`);
        panel.style.setProperty('--sy', `${card.offsetHeight / panel.offsetHeight}`);
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);
  return listRef;
}

/**
 * Cards dos professores: foto em card preto, com listra vermelha, nome e frase por
 * cima. No computador, com o mouse parado sobre o card (0,25 s, para não abrir de
 * passagem) ele vem para frente: cresce a partir do próprio lugar até um painel com a
 * foto grande e a biografia ao lado, deixando os outros professores à vista; tirou o
 * mouse, volta para dentro do card. No celular (ou janela estreita), o toque/clique
 * abre a biografia abaixo do card e outro toque fecha.
 * `card-open:` está em globals.css (mouse, toque ou teclado; só a partir de 1024 px).
 */
export function InstructorCards({ instructors }: { instructors: InstructorCardData[] }) {
  const tap = useTapToggle();
  const listRef = usePanelOrigins();

  return (
    <ul ref={listRef} className="relative grid gap-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {instructors.map((instructor) => {
        const expandable = instructor.bio.length > 0;
        const isOpen = expandable && tap.open === instructor.id;
        const bioId = `professor-bio-${instructor.id}`;

        const card = (
          <>
            <span className="absolute inset-0 block">
              <Portrait photo={instructor.photo} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="group-hover/card:scale-105" />
            </span>
            <span aria-hidden className="absolute inset-x-0 bottom-0 block h-3/4 bg-gradient-to-t from-gb-ink via-gb-ink/85 to-transparent" />
            <span className="relative block p-5">
              <span className="block border-t-4 border-gb-red pt-3 font-display text-2xl leading-tight font-bold uppercase text-gb-white">{instructor.name}</span>
              <span className="mt-2 block">
                {instructor.quote ? (
                  <Quote text={instructor.quote} tone="dark" className="text-sm" />
                ) : (
                  <span className="block border-l-2 border-dashed border-gb-line/60 pl-3 text-sm text-gb-line">
                    <span className="font-semibold uppercase tracking-wide">A confirmar · </span>frase e biografia, a enviar pelo cliente.
                  </span>
                )}
              </span>
            </span>
          </>
        );

        if (!expandable) {
          return (
            <li key={instructor.id} className={`relative flex flex-col justify-end overflow-hidden bg-gb-ink ${CARD_H}`}>
              {card}
            </li>
          );
        }

        return (
          <li key={instructor.id} data-open={isOpen} className="instructor-card group/card">
            {/* Fundo levemente escurecido enquanto o painel está à frente (não bloqueia o mouse). */}
            <span
              aria-hidden
              className="pointer-events-none fixed inset-0 z-20 hidden bg-gb-ink/35 opacity-0 transition-opacity duration-300 lg:block card-open:opacity-100 card-open:delay-200"
            />

            {/* O card fechado: foto, listra, nome e frase. */}
            <button
              type="button"
              data-card
              onPointerDown={tap.onPointerDown}
              onClick={() => tap.toggle(instructor.id)}
              aria-expanded={isOpen}
              aria-controls={bioId}
              className={`focus-ring relative flex w-full flex-col justify-end overflow-hidden bg-gb-ink text-left ${CARD_H}`}
            >
              {card}
              <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-gb-ink/85 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gb-white">
                <span aria-hidden className="text-gb-red">{isOpen ? '−' : '+'}</span> {isOpen ? 'Fechar' : 'Trajetória'}
              </span>
            </button>

            {/*
              Painel. Computador: guardado dentro do card (transform) e vem para frente ao
              abrir, com foto e biografia lado a lado. Celular: só a biografia, deslizando
              para baixo do card.
            */}
            <div
              id={bioId}
              data-panel
              className={`grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-data-[open=true]/card:grid-rows-[1fr]
                lg:pointer-events-none lg:absolute lg:top-(--panel-top) lg:left-(--panel-left) lg:z-30 lg:block lg:h-[39rem] lg:w-(--panel-w) lg:origin-top-left lg:opacity-0 lg:shadow-[0_50px_120px_-30px_rgb(0_0_0/0.7)]
                lg:[transform:translate(var(--dx,0),var(--dy,0))_scale(var(--sx,0.4),var(--sy,0.9))]
                lg:[transition:transform_600ms_cubic-bezier(0.22,1,0.36,1),opacity_200ms_ease_380ms]
                card-open:pointer-events-auto card-open:opacity-100 card-open:[transform:none]
                card-open:[transition:transform_600ms_cubic-bezier(0.22,1,0.36,1)_250ms,opacity_120ms_ease_250ms]`}
            >
              <div className="overflow-hidden lg:grid lg:h-full lg:grid-cols-[46%_1fr]">
                {/* Foto grande com o nome (só no computador). */}
                <div className="relative hidden flex-col justify-end overflow-hidden bg-gb-ink lg:flex">
                  <span className="absolute inset-0 block">
                    <Portrait photo={instructor.photo} sizes="400px" />
                  </span>
                  <span aria-hidden className="absolute inset-x-0 bottom-0 block h-2/3 bg-gradient-to-t from-gb-ink via-gb-ink/85 to-transparent" />
                  <div className="relative p-6">
                    <p className="border-t-4 border-gb-red pt-4 font-display text-3xl leading-none font-bold uppercase text-gb-white">{instructor.name}</p>
                  </div>
                </div>

                {/* Biografia. */}
                <div className="border-t-4 border-gb-red bg-gb-ink p-6 lg:flex lg:flex-col lg:justify-center-safe lg:overflow-y-auto lg:border-t-0 lg:border-l-4 lg:px-7 lg:py-7">
                  <div className="opacity-0 transition duration-300 group-data-[open=true]/card:opacity-100 lg:translate-y-3 lg:duration-100 lg:ease-out card-open:translate-y-0 card-open:opacity-100 card-open:delay-500 card-open:duration-500">
                    <BioContent instructor={instructor} />
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
