'use client';

import { useRef, useState, type PointerEvent } from 'react';
import { SitePhoto } from '@/components/ui/SitePhoto';
import type { Instructor } from '@/data/instructors';
import type { SiteImage } from '@/lib/content/site-images';

export type InstructorCardData = Instructor & { photo: SiteImage | null };

/**
 * Abre/fecha pelo toque (um card por vez). Mouse de verdade não usa o clique: quem
 * abre e fecha é o hover. O tipo do ponteiro é lido no início do toque porque no
 * Safari do iPhone o clique chega como "mouse" (mesma lógica do LegacyTimeline).
 */
export function useTapToggle() {
  const [open, setOpen] = useState<string | null>(null);
  const pointer = useRef('');
  return {
    open,
    onPointerDown: (event: PointerEvent) => (pointer.current = event.pointerType),
    toggle(id: string) {
      // Só a partir de 1024 px o hover abre o card; em janela estreita o clique do mouse também abre.
      const mouse = pointer.current === 'mouse' && window.matchMedia('(hover: hover) and (min-width: 1024px)').matches;
      pointer.current = '';
      if (!mouse) setOpen((current) => (current === id ? null : id));
    },
  };
}

/** Foto do professor ou espaço reservado (span: fica dentro de <button>). */
export function Portrait({ photo, sizes, className = '' }: { photo: SiteImage | null; sizes: string; className?: string }) {
  if (photo) {
    return <SitePhoto image={photo} sizes={sizes} className={`h-full w-full object-cover transition-transform duration-700 ease-out ${className}`} />;
  }
  return (
    <span className="flex h-full w-full items-start bg-gb-ink bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_10px)]">
      <span className="m-4 border border-dashed border-gb-line/50 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gb-line">Foto a definir</span>
    </span>
  );
}

/** Mensagem do professor para quem quer começar. */
export function Quote({ text, tone = 'light', className = '' }: { text: string; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <blockquote className={`relative pl-6 italic leading-relaxed ${tone === 'dark' ? 'text-gb-line' : 'text-gb-mute'} ${className}`}>
      <span aria-hidden className="absolute top-0 left-0 font-display text-4xl leading-none not-italic text-gb-red">“</span>
      {text}
    </blockquote>
  );
}

/** Credenciais + biografia, sobre fundo preto (`dark`) ou branco (`light`). */
export function BioContent({ instructor, tone = 'dark' }: { instructor: Instructor; tone?: 'light' | 'dark' }) {
  return (
    <>
      {instructor.credentials.length > 0 && (
        <p className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 font-display text-sm font-semibold uppercase tracking-[0.16em] ${tone === 'dark' ? 'text-gb-white' : 'text-gb-ink'}`}>
          {instructor.credentials.map((item, i) => (
            <span key={item} className="inline-flex items-center gap-2.5">
              {i > 0 && <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gb-red" />}
              {item}
            </span>
          ))}
        </p>
      )}
      <div className={`mt-4 space-y-3 text-[0.94rem] leading-relaxed lg:mt-3 lg:text-[0.88rem] ${tone === 'dark' ? 'text-gb-line' : 'text-gb-mute'}`}>
        {instructor.bio.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
    </>
  );
}
