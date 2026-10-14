import Link from 'next/link';

/**
 * Marca tipográfica provisória. O escudo oficial da Gracie Barra só deve
 * entrar quando o cliente fornecer o arquivo e a autorização de uso.
 */
export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const main = tone === 'dark' ? 'text-gb-ink' : 'text-gb-white';

  return (
    <Link href="/" className="focus-ring flex flex-col leading-none" aria-label="Gracie Barra Jardim das Américas, página inicial">
      <span className={`font-display text-2xl font-extrabold uppercase tracking-wide ${main}`}>
        Gracie <span className={tone === 'dark' ? 'text-gb-red' : 'text-gb-white'}>Barra</span>
      </span>
      <span className={`mt-0.5 font-display text-sm font-semibold uppercase tracking-[0.12em] ${tone === 'dark' ? 'text-gb-navy' : 'text-gb-line'}`}>
        Jardim das Américas
      </span>
    </Link>
  );
}
