'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin/mural', label: 'Fotos do mural' },
  { href: '/admin/retiradas', label: 'Pedidos de retirada' },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Painel" className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6">
      {links.map((link) => {
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
