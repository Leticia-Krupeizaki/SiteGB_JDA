import type { StaticImageData } from 'next/image';
import { siteImageSlots } from '@/data/site-images';

/** Foto pronta para o site (arquivo do projeto, em src/assets). */
export type SiteImage = { src: StaticImageData; alt: string };

const images: Record<string, SiteImage | null> = Object.fromEntries(siteImageSlots.map((slot) => [slot.key, slot.image]));

/**
 * Foto de cada espaço do site; `null` = ainda sem foto (mostra o quadro "a definir").
 * Site estático: as fotos são arquivos do projeto, definidos em src/data/site-images.ts.
 */
export function getSiteImages(): Record<string, SiteImage | null> {
  return images;
}
