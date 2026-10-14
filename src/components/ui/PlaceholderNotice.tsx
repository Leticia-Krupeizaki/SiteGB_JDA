import type { ReactNode } from 'react';

/** Indicação discreta, mas visível, de conteúdo que aguarda material oficial. */
export function PlaceholderNotice({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <p className={`border-l-2 border-dashed pl-4 text-sm ${tone === 'dark' ? 'border-gb-line/60 text-gb-line' : 'border-gb-mute text-gb-mute'}`}>
      <span className="font-semibold uppercase tracking-wide">A confirmar · </span>
      {children}
    </p>
  );
}

export function PlaceholderBadge({ label = 'A confirmar' }: { label?: string }) {
  return (
    <span className="inline-flex items-center border border-dashed border-current px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
      {label}
    </span>
  );
}
