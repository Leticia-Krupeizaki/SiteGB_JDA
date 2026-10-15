import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/logo-gb-jda.png';

/**
 * Escudo oficial da unidade + nome por extenso. Originais do cliente em assets/marca/.
 * `compactOnDesktop`: no cabeçalho largo o menu ocupa o espaço, então fica só o escudo
 * (que já traz o nome escrito).
 */
export function Logo({ tone = 'dark', compactOnDesktop = false }: { tone?: 'dark' | 'light'; compactOnDesktop?: boolean }) {
  const main = tone === 'dark' ? 'text-gb-ink' : 'text-gb-white';

  return (
    <Link href="/" className="focus-ring flex shrink-0 items-center gap-3 leading-none whitespace-nowrap" aria-label="Gracie Barra Jardim das Américas, página inicial">
      <Image
        src={logo}
        alt=""
        width={60}
        height={60}
        priority
        className={`h-12 w-12 shrink-0 sm:h-[52px] sm:w-[52px] ${compactOnDesktop ? 'lg:h-[60px] lg:w-[60px]' : ''}`}
      />
      <span className={`flex flex-col ${compactOnDesktop ? 'lg:hidden' : ''}`}>
        <span className={`font-display text-2xl font-extrabold uppercase tracking-wide ${main}`}>
          Gracie <span className={tone === 'dark' ? 'text-gb-red' : 'text-gb-white'}>Barra</span>
        </span>
        <span className={`mt-0.5 font-display text-sm font-semibold uppercase tracking-[0.12em] ${tone === 'dark' ? 'text-gb-navy' : 'text-gb-line'}`}>
          Jardim das Américas
        </span>
      </span>
    </Link>
  );
}
