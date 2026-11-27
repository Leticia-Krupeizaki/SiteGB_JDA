'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { CloseIcon } from '@/components/ui/icons';
import type { SiteImage } from '@/lib/content/site-images';

/**
 * Foto que amplia ao clicar: abre em tela cheia num <dialog> nativo (prende o foco,
 * fecha com Esc, clique fora ou no botão). No computador, ao passar o mouse, a foto
 * aproxima de leve e mostra "Ampliar".
 */
export function ExpandablePhoto({
  image,
  sizes,
  className = '',
  imageClassName = 'h-auto w-full',
}: {
  image: SiteImage;
  sizes: string;
  /** Classes do botão que envolve a foto. */
  className?: string;
  /** Classes da foto (padrão: largura total, altura proporcional). */
  imageClassName?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`Ampliar foto: ${image.alt}`}
        className={`focus-ring group relative block cursor-zoom-in overflow-hidden ${className}`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          sizes={sizes}
          className={`${imageClassName} transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
        />
        <span
          aria-hidden
          className="absolute top-4 right-4 hidden bg-gb-ink/80 px-3 py-1.5 font-display text-sm font-semibold tracking-wide text-gb-white uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 lg:block"
        >
          Ampliar
        </span>
      </button>
      <dialog
        ref={dialog}
        aria-label="Foto ampliada"
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-gb-ink/90"
      >
        <div className="relative">
          <Image
            src={image.src}
            alt={image.alt}
            sizes="100vw"
            className="h-auto max-h-[90vh] w-auto max-w-[min(94vw,100rem)]"
          />
          <button
            type="button"
            onClick={close}
            className="focus-ring absolute top-3 right-3 inline-flex min-h-11 items-center gap-1 bg-gb-ink px-4 font-display font-semibold text-gb-white uppercase"
          >
            <CloseIcon className="h-4 w-4" /> Fechar
          </button>
        </div>
      </dialog>
    </>
  );
}
