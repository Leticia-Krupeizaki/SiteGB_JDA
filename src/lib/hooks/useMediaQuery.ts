'use client';

import { useSyncExternalStore } from 'react';

/** Mesmo ponto de quebra do `md` do Tailwind: abaixo dele, o site trata como celular. */
export const mobileQuery = '(max-width: 47.99rem)';
/** Mesmo ponto de quebra do `lg` do Tailwind. */
export const wideQuery = '(min-width: 64rem)';

/**
 * Acompanha uma media query. No servidor (e na hidratação) vale `serverValue`;
 * o layout visual deve vir do CSS, este hook só ajusta comportamento e ARIA.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
