import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/** Área administrativa: fora do grupo (site), sem menu público e sem indexação. */
export const metadata: Metadata = {
  title: { default: 'Painel', template: '%s | Painel Gracie Barra JDA' },
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gb-line/60">{children}</div>;
}
