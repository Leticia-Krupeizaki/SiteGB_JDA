import Link from 'next/link';
import { site } from '@/config/site';
import type { SiteImage } from '@/lib/content/site-images';
import { SitePhoto } from '@/components/ui/SitePhoto';

/**
 * Nome da unidade em texto, no lugar do logotipo (pedido do cliente).
 * "Gracie Barra" sai em UMA cor, como nas combinações do manual da marca
 * (p. 9–10): preto sobre branco, branco sobre fundo escuro. Não é o logotipo
 * oficial "Linear"/"Verticalizada"; trocar pelo arquivo oficial quando houver
 * (docs/IDENTIDADE-VISUAL.md).
 *
 * `premium`: mostra "Premium" na segunda linha. Só onde há espaço (rodapé):
 * no cabeçalho a linha ficaria ~60 px mais larga e o menu não caberia em 1024 px
 * nem no celular. O nome completo segue no aria-label.
 *
 * `image`: logo oficial da escola à esquerda do nome (cabeçalho, pedido do cliente).
 */
export function Logo({ tone = 'dark', premium = false, image }: { tone?: 'dark' | 'light'; premium?: boolean; image?: SiteImage | null }) {
  const main = tone === 'dark' ? 'text-gb-ink' : 'text-gb-white';

  return (
    <Link href="/" className="focus-ring flex shrink-0 items-center gap-2 leading-none xl:gap-2.5 whitespace-nowrap" aria-label={`${site.name}, página inicial`}>
      {image && <SitePhoto image={{ ...image, alt: '' }} priority sizes="(min-width: 1280px) 56px, 40px" className="h-10 w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14" />}
      <span className="flex flex-col">
        <span className={`font-display text-2xl font-extrabold uppercase tracking-wide ${main}`}>Gracie Barra</span>
        <span className={`mt-0.5 font-display text-sm font-semibold uppercase tracking-[0.12em] ${tone === 'dark' ? 'text-gb-navy' : 'text-gb-line'}`}>
          {premium && 'Premium '}Jardim das Américas
        </span>
      </span>
    </Link>
  );
}
