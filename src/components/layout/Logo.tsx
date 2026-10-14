import Link from 'next/link';

/**
 * Marca tipográfica provisória. O escudo oficial da Gracie Barra só deve
 * entrar quando o cliente fornecer o arquivo e a autorização de uso.
 */
export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const main = tone === 'dark' ? 'text-neutral-900' : 'text-white';

  return (
    <Link href="/" className="focus-ring flex flex-col leading-none" aria-label="Gracie Barra Jardim das Américas, página inicial">
      <span className={`font-display text-xl font-bold uppercase tracking-wide ${main}`}>
        Gracie <span className="text-brand-red">Barra</span>
      </span>
      <span className={`mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${tone === 'dark' ? 'text-neutral-600' : 'text-neutral-300'}`}>
        Jardim das Américas
      </span>
    </Link>
  );
}
