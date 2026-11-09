'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SitePhoto } from '@/components/ui/SitePhoto';
import type { LegacyMaster } from '@/data/legacy';
import type { SiteImage } from '@/lib/content/site-images';

export type IntroMaster = Pick<LegacyMaster, 'id' | 'name' | 'subtitle' | 'headline'> & { photo: SiteImage | null };

/** Guardado ao terminar ou pular: a abertura passa uma vez por visita (aba do navegador). */
const SEEN_KEY = 'gb-abertura-vista';
const OVERLAY_ID = 'gb-abertura';

/** Duração de cada cena, em ms: abertura, um mestre, fechamento. */
const OPENING_MS = 1800;
const MASTER_MS = 2000;
const CLOSING_MS = 4500;

type Props = {
  masters: IntroMaster[];
  /** Link do botão de aula experimental no fechamento. */
  ctaHref: string;
  ctaLabel: string;
};

/**
 * Abertura do site (página inicial): o legado dos cinco mestres passa sozinho, cena
 * a cena, como um vídeo curto, e depois mostra o site. Uma vez por visita; "Pular",
 * "Entrar no site" ou Esc fecham. A tela já sai pronta do servidor (o site não pisca
 * antes); para quem já viu nesta visita, o script abaixo a esconde antes de pintar.
 */
export function LegacyIntro({ masters, ctaHref, ctaLabel }: Props) {
  // 'pending': ainda não sabemos se esta visita já viu.
  const [open, setOpen] = useState<boolean | 'pending'>('pending');
  const [scene, setScene] = useState(0);
  const skipRef = useRef<HTMLButtonElement>(null);

  const last = masters.length + 1;
  const duration = (i: number) => (i === 0 ? OPENING_MS : i === last ? CLOSING_MS : MASTER_MS);

  const close = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {}
    setOpen(false);
  }, []);

  // Decide no navegador se passa ou não.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) !== null;
    } catch {}
    setOpen(!seen);
  }, []);

  // Avança as cenas; no fim, fecha.
  useEffect(() => {
    if (open !== true) return;
    const ms = scene === 0 ? OPENING_MS : scene === last ? CLOSING_MS : MASTER_MS;
    const timer = setTimeout(() => (scene < last ? setScene(scene + 1) : close()), ms);
    return () => clearTimeout(timer);
  }, [open, scene, last, close]);

  // Enquanto aberta: sem rolagem por trás, foco no "Pular", Esc fecha.
  useEffect(() => {
    if (open !== true) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    skipRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const master = scene > 0 && scene < last ? masters[scene - 1] : null;

  return (
    <>
      {/* Quem já viu nesta visita: esconde a abertura antes de pintar. Sem JavaScript, nunca aparece. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem('${SEEN_KEY}'))document.head.insertAdjacentHTML('beforeend','<style>#${OVERLAY_ID}{display:none}</style>')}catch(e){}`,
        }}
      />
      <noscript>
        <style>{`#${OVERLAY_ID}{display:none}`}</style>
      </noscript>

      {open !== false && (
        <div
          id={OVERLAY_ID}
          role="dialog"
          aria-modal="true"
          aria-label="Abertura: o legado Gracie Barra"
          className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-gb-ink text-gb-white"
        >
          {/* Progresso por cena e "Pular", por cima de tudo. */}
          <div className="relative z-20 flex items-center gap-4 px-4 pt-4 sm:px-8 sm:pt-6">
            <ol aria-hidden className="flex flex-1 gap-1.5">
              {Array.from({ length: last + 1 }, (_, i) => (
                <li key={i} className="h-1 flex-1 overflow-hidden bg-gb-white/20">
                  <span
                    key={i === scene ? `ativo-${scene}` : i}
                    className={`block h-full bg-gb-red ${i < scene ? 'w-full' : i === scene && open === true ? 'animate-intro-fill' : 'w-0'}`}
                    style={i === scene ? { animationDuration: `${duration(i)}ms` } : undefined}
                  />
                </li>
              ))}
            </ol>
            <button
              ref={skipRef}
              type="button"
              onClick={close}
              className="focus-ring shrink-0 border border-gb-white/60 px-4 py-2 font-display text-base font-semibold uppercase tracking-wide hover:bg-gb-white hover:text-gb-ink"
            >
              Pular
            </button>
          </div>

          <div key={scene} className="relative flex flex-1 items-end sm:items-center">
            {scene === 0 && (
              <div className="mx-auto w-full max-w-4xl px-6 pb-24 text-center sm:pb-0">
                <p className="animate-rise [animation-duration:0.6s] font-display text-lg font-semibold uppercase tracking-[0.3em] text-gb-red">De 1914 até hoje</p>
                <p className="animate-rise [animation-duration:0.6s] mt-4 font-display text-6xl leading-[0.9] font-bold uppercase [animation-delay:0.15s] sm:text-8xl">O legado Gracie Barra</p>
                <p className="animate-rise [animation-duration:0.6s] mx-auto mt-6 max-w-xl text-xl text-gb-line [animation-delay:0.3s]">Cinco mestres. Uma linhagem. Um caminho que chega ao nosso tatame.</p>
              </div>
            )}

            {master && (
              <>
                {master.photo && (
                  <div className="absolute inset-0 overflow-hidden lg:left-auto lg:w-1/2">
                    <SitePhoto image={master.photo} sizes="(min-width: 1024px) 50vw, 100vw" className="animate-ken-burns h-full w-full object-cover" />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-gb-ink from-30% via-gb-ink/75 via-50% to-transparent to-80% lg:bg-gradient-to-r lg:from-0% lg:via-gb-ink/20 lg:via-30% lg:to-100%" />
                  </div>
                )}
                <div className="relative w-full px-6 pb-16 sm:px-12 lg:w-1/2 lg:pb-0 lg:pl-[max(3rem,calc((100vw-72rem)/2+2rem))]">
                  <p className="animate-rise [animation-duration:0.6s] font-display text-lg font-semibold uppercase tracking-[0.25em] text-gb-red">
                    0{scene} · {master.subtitle}
                  </p>
                  <p className="animate-rise [animation-duration:0.6s] mt-3 font-display text-6xl leading-[0.9] font-bold uppercase [animation-delay:0.1s] sm:text-8xl">{master.name}</p>
                  <p className="animate-rise [animation-duration:0.6s] mt-5 max-w-lg font-display text-2xl leading-tight font-semibold uppercase text-gb-line [animation-delay:0.25s] sm:text-3xl">
                    {master.headline}
                  </p>
                </div>
              </>
            )}

            {scene === last && (
              <div className="mx-auto w-full max-w-3xl px-6 pb-20 text-center sm:pb-0">
                <p className="animate-rise [animation-duration:0.6s] font-display text-lg font-semibold uppercase tracking-[0.3em] text-gb-red">Capítulo 06</p>
                <p className="animate-rise [animation-duration:0.6s] mt-4 font-display text-6xl leading-[0.9] font-bold uppercase [animation-delay:0.1s] sm:text-8xl">O próximo capítulo é seu</p>
                <p className="animate-rise [animation-duration:0.6s] mx-auto mt-6 max-w-xl text-xl text-gb-line [animation-delay:0.25s]">A história que começou em 1914 continua a cada treino.</p>
                <p className="animate-rise [animation-duration:0.6s] mt-4 font-display text-3xl font-bold uppercase text-gb-red [animation-delay:0.45s] sm:text-4xl">A história continua com você.</p>
                <div className="animate-rise [animation-duration:0.6s] mt-10 flex flex-col justify-center gap-3 [animation-delay:0.65s] sm:flex-row">
                  <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex min-h-12 items-center justify-center bg-gb-red px-8 py-3 font-display text-lg font-semibold uppercase tracking-wide hover:bg-gb-red-dark"
                  >
                    {ctaLabel}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                  <button
                    type="button"
                    onClick={close}
                    className="focus-ring inline-flex min-h-12 items-center justify-center border-2 border-gb-white px-8 py-3 font-display text-lg font-semibold uppercase tracking-wide hover:bg-gb-white hover:text-gb-ink"
                  >
                    Entrar no site
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
