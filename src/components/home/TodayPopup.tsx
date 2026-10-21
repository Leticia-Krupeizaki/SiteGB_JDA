'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from '@/components/ui/icons';
import type { Weekday } from '@/data/schedule';
import { academyTimeZone, defaultDay } from '@/lib/schedule';
import { TodayOnMat } from './TodayOnMat';

/** Uma vez por visita: some ao navegar ou recarregar; volta numa nova visita (nova sessão do navegador). */
const seenKey = 'gb-hoje-no-tatame-visto';

/**
 * Pop-up "Hoje no tatame" ao abrir o site (pedido do cliente: informação
 * importante). <dialog> nativo: prende o foco, fecha com Esc, com o botão ou
 * clicando fora. Só no navegador, então não afeta o HTML lido por buscadores.
 */
export function TodayPopup() {
  const ref = useRef<HTMLDialogElement>(null);
  const [day, setDay] = useState<{ day: Weekday; isToday: boolean } | null>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(seenKey) === '1';
      sessionStorage.setItem(seenKey, '1');
    } catch {
      // Armazenamento bloqueado (ex.: modo privado restrito): mostra só nesta carga de página.
    }
    if (!seen) setDay(defaultDay(new Date(), academyTimeZone));
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (day && dialog && !dialog.open) {
      dialog.showModal();
      // Foco no quadro (sem contorno), não no "x": o leitor de tela anuncia o título e o Tab segue para os botões.
      dialog.querySelector<HTMLElement>('[data-initial-focus]')?.focus();
    }
  }, [day]);

  if (!day) return null;

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-labelledby="popup-hoje-titulo"
      onClose={() => setDay(null)}
      onClick={(event) => {
        if (event.target === ref.current) close();
      }}
      className="m-auto w-[min(30rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto bg-transparent p-0 backdrop:bg-gb-ink/70"
    >
      <div data-initial-focus tabIndex={-1} className="relative bg-gb-white focus:outline-none">
        <button
          type="button"
          onClick={close}
          className="focus-ring absolute top-1.5 right-1.5 z-10 inline-flex h-10 w-10 items-center justify-center text-gb-white hover:text-gb-line"
        >
          <CloseIcon className="h-5 w-5" />
          <span className="sr-only">Fechar</span>
        </button>
        {/* pr no topo para o "x" não cobrir o dia da semana */}
        <div className="[&>div>div:first-child]:pr-14">
          <TodayOnMat initial={day} titleId="popup-hoje-titulo" />
        </div>
        <div className="flex flex-col gap-2 border-t border-gb-line p-4 sm:flex-row">
          <Link
            href="/horarios"
            onClick={close}
            className="focus-ring inline-flex min-h-11 flex-1 items-center justify-center bg-gb-red px-4 font-display text-lg font-semibold uppercase tracking-wide text-gb-white hover:bg-gb-red-dark"
          >
            Ver a grade completa
          </Link>
          <button
            type="button"
            onClick={close}
            className="focus-ring min-h-11 flex-1 border-2 border-gb-ink px-4 font-display text-lg font-semibold uppercase tracking-wide hover:bg-gb-ink hover:text-gb-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </dialog>
  );
}
