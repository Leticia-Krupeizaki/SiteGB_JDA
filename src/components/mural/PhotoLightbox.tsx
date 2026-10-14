'use client';

import { useEffect, useRef } from 'react';
import { CloseIcon } from '@/components/ui/icons';
import { categoryLabel } from '@/data/mural';
import type { PublicMuralPost } from '@/types/mural';
import { DemoPhotoTile } from './DemoPhotoTile';

type Props = {
  post: PublicMuralPost | null;
  index: number;
  total: number;
  onClose: () => void;
  onNavigate: (delta: number) => void;
};

/**
 * Lightbox com <dialog> nativo: prende o foco, fecha com Esc e devolve o foco
 * ao item que o abriu. Setas do teclado navegam entre as fotos.
 */
export function PhotoLightbox({ post, index, total, onClose, onNavigate }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (post && !dialog.open) dialog.showModal();
    if (!post && dialog.open) dialog.close();
  }, [post]);

  return (
    <dialog
      ref={ref}
      aria-label="Foto ampliada"
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') onNavigate(1);
        if (event.key === 'ArrowLeft') onNavigate(-1);
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className="m-auto w-[min(56rem,calc(100vw-2rem))] bg-transparent p-0 backdrop:bg-gb-ink/90"
    >
      {post && (
        <figure className="bg-gb-white">
          <div className="flex max-h-[70vh] justify-center overflow-hidden bg-gb-ink">
            <div className="w-full" style={{ maxWidth: `calc(70vh * ${post.aspectRatio})` }}>
              <DemoPhotoTile post={post} index={index} large />
            </div>
          </div>
          <figcaption className="flex flex-wrap items-center justify-between gap-3 p-4">
            <span>
              <span className="font-display text-xl font-bold uppercase">{categoryLabel[post.category]}</span>
              <span className="ml-3 text-sm text-gb-mute tabular-nums">
                {index + 1} de {total}
              </span>
            </span>
            <span className="flex gap-2">
              <button type="button" onClick={() => onNavigate(-1)} className="focus-ring min-h-11 border-2 border-gb-ink px-4 font-display font-semibold uppercase">
                Anterior
              </button>
              <button type="button" onClick={() => onNavigate(1)} className="focus-ring min-h-11 border-2 border-gb-ink px-4 font-display font-semibold uppercase">
                Próxima
              </button>
              <button type="button" onClick={onClose} className="focus-ring inline-flex min-h-11 items-center gap-1 bg-gb-ink px-4 font-display font-semibold uppercase text-gb-white">
                <CloseIcon className="h-4 w-4" /> Fechar
              </button>
            </span>
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}
