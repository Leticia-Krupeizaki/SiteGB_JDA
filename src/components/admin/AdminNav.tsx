'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AdminRole } from './types';

/** `adminOnly`: só aparece para administradores (o servidor confere de novo). */
const links = [
  { href: '/admin/mural', label: 'Fotos do mural' },
  { href: '/admin/retiradas', label: 'Pedidos de retirada' },
  { href: '/admin/curriculos', label: 'Currículos', adminOnly: true },
  { href: '/admin/fotos', label: 'Fotos do site', adminOnly: true },
];

export function AdminNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Painel" className="mx-auto flex max-w-7xl flex-wrap gap-1 px-4 sm:px-6">
      {links.filter((link) => !link.adminOnly || role === 'ADMIN').map((link) => {
        const current = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? 'page' : undefined}
            className={`focus-ring px-4 py-2 font-display text-lg font-semibold uppercase ${current ? 'bg-gb-line/60 text-gb-ink' : 'text-gb-line hover:text-gb-white'}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
