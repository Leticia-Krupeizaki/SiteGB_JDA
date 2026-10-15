'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { mainNavigation, primaryCta } from '@/config/navigation';
import { contact, phoneUrl, whatsappTrialUrl } from '@/config/site';
import { CloseIcon, MenuIcon, PhoneIcon } from '@/components/ui/icons';
import { Logo } from './Logo';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao navegar.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = 'hidden';
    document.body.dataset.menuOpen = 'true';
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      delete document.body.dataset.menuOpen;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    // Sem backdrop-filter: ele criaria um bloco de contenção e quebraria o painel `fixed` do menu mobile.
    <header className="sticky top-0 z-40 border-b border-gb-line bg-gb-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNavigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`focus-ring border-b-2 px-2.5 py-2 font-display text-lg font-semibold uppercase tracking-wide whitespace-nowrap transition-colors ${
                      active ? 'border-gb-red text-gb-ink' : 'border-transparent text-gb-ink hover:border-gb-line'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={phoneUrl}
            className="focus-ring hidden items-center gap-2 px-2 py-2 text-sm font-semibold whitespace-nowrap text-gb-navy hover:text-gb-red 2xl:inline-flex"
          >
            <PhoneIcon className="h-4 w-4" />
            {contact.displayPhone}
          </a>
          <a
            href={whatsappTrialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring hidden min-h-11 items-center bg-gb-red px-4 font-display text-lg font-semibold uppercase tracking-wide whitespace-nowrap text-gb-white transition-colors hover:bg-gb-red-dark sm:inline-flex"
          >
            {primaryCta.label}
            <span className="sr-only">(abre o WhatsApp em nova aba)</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="focus-ring inline-flex h-11 w-11 items-center justify-center text-gb-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
            <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-gb-white lg:hidden"
        >
          <nav aria-label="Principal (celular)" className="px-4 py-6">
            <ul className="divide-y divide-gb-line border-y border-gb-line">
              {mainNavigation.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`focus-ring flex min-h-14 items-center font-display text-3xl font-semibold uppercase ${
                        active ? 'text-gb-red' : 'text-gb-ink'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-col gap-3">
              <a
                href={whatsappTrialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex min-h-12 items-center justify-center bg-gb-red px-4 font-display text-lg font-semibold uppercase tracking-wide text-gb-white"
              >
                {primaryCta.label}
                <span className="sr-only">(abre o WhatsApp em nova aba)</span>
              </a>
              <a
                href={phoneUrl}
                className="focus-ring flex min-h-12 items-center justify-center gap-2 border-2 border-gb-navy px-4 font-semibold text-gb-navy"
              >
                <PhoneIcon className="h-4 w-4" />
                Ligar: {contact.displayPhone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
