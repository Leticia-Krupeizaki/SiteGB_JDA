import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'inverted' | 'light';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-red text-white hover:bg-brand-red-dark',
  secondary: 'border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white',
  inverted: 'border-2 border-white text-white hover:bg-white hover:text-neutral-900',
  light: 'bg-white text-brand-red hover:bg-neutral-100',
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  /** Links externos (WhatsApp, plataformas) abrem em nova aba com segurança. */
  external?: boolean;
  className?: string;
};

export function ButtonLink({ href, children, variant = 'primary', external = false, className = '' }: Props) {
  const classes = `focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${variants[variant]} ${className}`;

  if (external || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
        {external && <span className="sr-only">(abre em nova aba)</span>}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
