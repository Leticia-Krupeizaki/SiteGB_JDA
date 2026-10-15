'use client';

import { useRef, useState, type ReactNode } from 'react';
import { mobileQuery, useMediaQuery } from '@/lib/hooks/useMediaQuery';

/**
 * Passo a passo só no celular. Todos os campos ficam sempre no mesmo <form>
 * (nada se perde ao voltar); abaixo de `md` o CSS esconde as etapas que não
 * estão ativas. No computador o formulário aparece inteiro.
 */
export type WizardStepDef = { title: string; fields: string[] };

export function useWizard(steps: WizardStepDef[]) {
  const [current, setCurrent] = useState(0);
  const isMobile = useMediaQuery(mobileQuery);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);
  const last = steps.length - 1;

  const goTo = (index: number) => {
    setCurrent(index);
    // Leva o foco (e o leitor de tela) para o título da nova etapa.
    requestAnimationFrame(() => {
      const heading = headings.current[index];
      heading?.focus();
      heading?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  };

  /** Erros só dos campos da etapa informada. */
  const errorsIn = (errors: Record<string, string | undefined>, index: number) =>
    Object.fromEntries(Object.entries(errors).filter(([key, value]) => value && steps[index].fields.includes(key))) as Record<string, string>;

  /** Primeira etapa com algum erro (para levar o visitante até ela). */
  const firstStepWithError = (errors: Record<string, string | undefined>) => {
    const index = steps.findIndex((step) => step.fields.some((field) => errors[field]));
    return index === -1 ? current : index;
  };

  return {
    current,
    isMobile,
    isLast: current === last,
    /** No celular, fora da última etapa, o botão principal avança em vez de enviar. */
    shouldAdvance: isMobile && current < last,
    goTo,
    reset: () => setCurrent(0),
    errorsIn,
    firstStepWithError,
    headingRef: (index: number) => (el: HTMLHeadingElement | null) => {
      headings.current[index] = el;
    },
    steps,
  };
}

type Wizard = ReturnType<typeof useWizard>;

export function WizardProgress({ wizard }: { wizard: Wizard }) {
  return (
    <ol aria-label="Etapas" className="flex gap-1.5 md:hidden">
      {wizard.steps.map((step, index) => (
        <li
          key={step.title}
          aria-current={index === wizard.current ? 'step' : undefined}
          className={`h-1.5 flex-1 ${index <= wizard.current ? 'bg-gb-navy' : 'bg-gb-line'}`}
        >
          <span className="sr-only">
            {step.title}
            {index < wizard.current ? ' (concluída)' : index === wizard.current ? ' (atual)' : ''}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function WizardStep({ wizard, index, children }: { wizard: Wizard; index: number; children: ReactNode }) {
  const total = wizard.steps.length;
  return (
    <div className={`space-y-6 ${index === wizard.current ? '' : 'max-md:hidden'}`}>
      <h3 ref={wizard.headingRef(index)} tabIndex={-1} className="scroll-mt-28 font-display text-2xl font-bold uppercase focus:outline-none md:hidden">
        <span className="block text-sm font-semibold tracking-wide text-gb-mute">
          Passo {index + 1} de {total}
        </span>
        {wizard.steps[index].title}
      </h3>
      {children}
    </div>
  );
}

/**
 * Botões do rodapé do formulário. O botão principal é sempre `submit` (Enter
 * funciona); o formulário decide se avança ou envia. O texto troca por CSS
 * para não piscar na hidratação.
 */
export function WizardNav({ wizard, submitLabel, sending }: { wizard: Wizard; submitLabel: string; sending: boolean }) {
  const primary = 'focus-ring min-h-12 bg-gb-red px-6 font-display text-xl font-semibold uppercase text-gb-white hover:bg-gb-red-dark disabled:opacity-70';
  return (
    <div className="flex gap-3 max-md:sticky max-md:bottom-0 max-md:-mx-4 max-md:border-t max-md:border-gb-line max-md:bg-gb-white max-md:px-4 max-md:py-3">
      {wizard.current > 0 && (
        <button
          type="button"
          onClick={() => wizard.goTo(wizard.current - 1)}
          className="focus-ring min-h-12 border-2 border-gb-ink px-5 font-display text-xl font-semibold uppercase md:hidden"
        >
          Voltar
        </button>
      )}
      <button type="submit" disabled={sending} aria-busy={sending} className={`${primary} flex-1 md:flex-none`}>
        {sending ? (
          'Enviando…'
        ) : (
          <>
            <span className="md:hidden">{wizard.isLast ? submitLabel : 'Próximo'}</span>
            <span className="max-md:hidden">{submitLabel}</span>
          </>
        )}
      </button>
    </div>
  );
}
