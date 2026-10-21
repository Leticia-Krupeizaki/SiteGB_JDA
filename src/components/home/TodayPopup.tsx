'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ClockIcon, CloseIcon } from '@/components/ui/icons';
import type { Weekday } from '@/data/schedule';
import { academyTimeZone, defaultDay } from '@/lib/schedule';
import { TodayOnMat } from './TodayOnMat';

/**
 * Botão flutuante "Aulas de hoje", ao lado do botão do WhatsApp (pedido do
 * cliente), que abre o quadro "Hoje no tatame". Não abre sozinho.
 * <dialog> nativo: prende o foco, fecha com Esc, com o botão ou clicando fora, e
 * devolve o foco ao botão flutuante ao fechar.
 */
export function TodayPopup() {
  const ref = useRef<HTMLDialogElement>(null);
  const [day, setDay] = useState<{ day: Weekday; isToday: boolean } | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (day && dialog && !dialog.open) {
      dialog.showModal();
      // Foco no quadro (sem contorno), não no "x": o leitor de tela anuncia o título e o Tab segue para os botões.
      dialog.querySelector<HTMLElement>('[data-initial-focus]')?.focus();
    }
  }, [day]);

  // O dia é calculado na hora do clique, então vale mesmo com a página aberta desde ontem.
  const open = () => setDay(defaultDay(new Date(), academyTimeZone));
  const close = () => ref.current?.close();

  return (
    <>
      {/*
       * Mesmo formato do botão do WhatsApp, à esquerda dele: distância da borda do
       * WhatsApp + 3,5rem do botão + 0,75rem de espaço. Some com o menu mobile e
       * durante o formulário passo a passo do mural no celular. Borda branca para
       * não sumir sobre os fundos pretos (topo da Home, rodapé). Fundo preto a 55%
       * (pedido do cliente): deixa ver o texto por trás e mantém o branco legível
       * sobre fundo claro (4,7:1); fica sólido no hover.
       */}
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        title="Aulas de hoje"
        className="focus-ring fixed right-[5.25rem] bottom-4 z-30 inline-flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-gb-ink/55 text-gb-white shadow-lg ring-2 ring-gb-white transition hover:scale-105 hover:bg-gb-ink in-data-menu-open:hidden in-data-wizard-open:max-md:hidden sm:right-[5.75rem] sm:bottom-6 sm:w-auto sm:px-5"
      >
        <ClockIcon className="h-7 w-7 shrink-0" />
        <span className="max-sm:sr-only font-display text-lg font-semibold uppercase tracking-wide whitespace-nowrap">Aulas de hoje</span>
      </button>

      {day && (
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
      )}
    </>
  );
}
