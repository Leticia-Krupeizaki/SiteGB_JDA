import Link from 'next/link';

/**
 * Nome da unidade em texto, no lugar do logotipo (pedido do cliente).
 * "Gracie Barra" sai em UMA cor, como nas combinações do manual da marca
 * (p. 9–10): preto sobre branco, branco sobre fundo escuro. Não é o logotipo
 * oficial "Linear"/"Verticalizada"; trocar pelo arquivo oficial quando houver
 * (docs/IDENTIDADE-VISUAL.md).
 */
export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const main = tone === 'dark' ? 'text-gb-ink' : 'text-gb-white';

  return (
    <Link href="/" className="focus-ring flex shrink-0 flex-col leading-none whitespace-nowrap" aria-label="Gracie Barra Jardim das Américas, página inicial">
      <span className={`font-display text-2xl font-extrabold uppercase tracking-wide ${main}`}>Gracie Barra</span>
      <span className={`mt-0.5 font-display text-sm font-semibold uppercase tracking-[0.12em] ${tone === 'dark' ? 'text-gb-navy' : 'text-gb-line'}`}>
        Jardim das Américas
      </span>
    </Link>
  );
}
