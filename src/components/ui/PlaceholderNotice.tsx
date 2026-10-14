import type { ReactNode } from 'react';

/** Marca visível para conteúdo provisório, aguardando material oficial do cliente. */
export function PlaceholderNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-md border border-dashed border-amber-500 bg-amber-50 p-4 text-sm text-amber-900">
      <span aria-hidden className="font-bold">!</span>
      <p>
        <strong className="font-semibold">Conteúdo provisório.</strong> {children}
      </p>
    </div>
  );
}

export function PlaceholderBadge({ label = 'Provisório' }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-amber-500 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-900">
      {label}
    </span>
  );
}
