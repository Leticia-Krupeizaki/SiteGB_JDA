import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'outline-light' | 'light';

const variants: Record<Variant, string> = {
  primary: 'bg-gb-red text-gb-white hover:bg-gb-red-dark',
  outline: 'border-2 border-gb-ink text-gb-ink hover:bg-gb-ink hover:text-gb-white',
  'outline-light': 'border-2 border-gb-white text-gb-white hover:bg-gb-white hover:text-gb-navy',
  // No hover o fundo fica cinza; o vermelho mais escuro mantém o contraste (4,97:1).
  light: 'bg-gb-white text-gb-red hover:bg-gb-line hover:text-gb-red-dark',
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
  const classes = `focus-ring inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 font-display text-lg font-semibold uppercase tracking-wide transition-colors ${variants[variant]} ${className}`;

  if (external || href.startsWith('tel:')) {
    return (
      <a href={href} className={classes} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
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
