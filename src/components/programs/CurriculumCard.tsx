'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from '@/components/ui/icons';
import type { Curriculum } from '@/data/curriculums';

const buttonClass = 'focus-ring inline-flex min-h-11 items-center justify-center px-4 font-display text-base font-semibold uppercase tracking-wide transition-colors';

/** Bloqueia "Salvar imagem como" e arrastar a imagem. Só dificulta: print de tela continua possível. */
const noSave = {
  onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
  onDragStart: (event: React.DragEvent) => event.preventDefault(),
  draggable: false,
};

/**
 * Card do currículo com visualizador em <dialog> nativo (prende o foco, fecha com
 * Esc, com o botão ou clicando fora). Só visualização: não há PDF publicado nem
 * botão de download (pedido do cliente). "Ampliar" mostra o pôster no tamanho real,
 * com rolagem, para ler o texto pequeno no celular.
 */
export function CurriculumCard({ curriculum }: { curriculum: Curriculum }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const name = `Currículo ${curriculum.title}`;
  const titleId = `curriculo-${curriculum.slug}-titulo`;

  useEffect(() => {
    const dialog = ref.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  const show = () => {
    setZoomed(false);
    setOpen(true);
  };
  const close = () => ref.current?.close();

  return (
    <li className="flex flex-col bg-gb-white">
      {/* Miniatura clicável. Decorativa para leitor de tela (o botão "Ver currículo" já descreve a ação). */}
      <button type="button" onClick={show} tabIndex={-1} aria-hidden className="block cursor-zoom-in border-b border-gb-line">
        <Image src={curriculum.preview} alt="" sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 90vw" className="h-auto w-full select-none" {...noSave} />
      </button>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="font-display text-2xl font-bold uppercase leading-tight">{name}</h4>
        {curriculum.audience && <p className="mt-1 text-sm text-gb-mute">{curriculum.audience}</p>}
        <p className="mt-2 text-sm text-gb-mute">
          16 semanas · Aulas A e B · Versão {curriculum.version}
        </p>
        <div className="mt-auto pt-4">
          <button type="button" onClick={show} aria-haspopup="dialog" className={`${buttonClass} w-full border-2 border-gb-ink text-gb-ink hover:bg-gb-ink hover:text-gb-white`}>
            Ver currículo
            <span className="sr-only"> {curriculum.title}</span>
          </button>
        </div>
      </div>

      {open && (
        <dialog
          ref={ref}
          aria-labelledby={titleId}
          onClose={() => setOpen(false)}
          onClick={(event) => {
            if (event.target === ref.current) close();
          }}
          className="m-auto h-[calc(100dvh-2rem)] max-h-none w-[min(64rem,calc(100vw-2rem))] max-w-none bg-transparent p-0 backdrop:bg-gb-ink/85"
        >
          <div className="flex h-full flex-col bg-gb-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gb-line p-3">
              <h2 id={titleId} className="font-display text-xl font-bold uppercase sm:text-2xl">
                {name}
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setZoomed((value) => !value)}
                  aria-pressed={zoomed}
                  className={`${buttonClass} border-2 border-gb-ink text-gb-ink hover:bg-gb-ink hover:text-gb-white`}
                >
                  {zoomed ? 'Ajustar à tela' : 'Ampliar'}
                </button>
                <button type="button" onClick={close} className={`${buttonClass} gap-1 bg-gb-ink text-gb-white hover:bg-gb-navy`}>
                  <CloseIcon className="h-4 w-4" /> Fechar
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-gb-line/60">
              {/* unoptimized: entrega o arquivo de 1800 px como está, para o texto pequeno continuar nítido. */}
              <Image
                src={curriculum.full}
                alt={`${name}: 16 semanas de aulas, com as técnicas das aulas A e B de cada semana`}
                unoptimized
                className={`mx-auto h-auto select-none ${zoomed ? 'w-[1800px] max-w-none' : 'w-full'}`}
                {...noSave}
              />
            </div>
          </div>
        </dialog>
      )}
    </li>
  );
}
