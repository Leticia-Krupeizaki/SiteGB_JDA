/**
 * Ponta de faixa com graus: elemento gráfico tirado do próprio tatame.
 * Barra preta com a ponteira vermelha e as fitas brancas dos graus.
 */
export function Belt({ degrees = 4, className = '' }: { degrees?: number; className?: string }) {
  return (
    <div aria-hidden className={`flex h-3 w-full items-stretch ${className}`}>
      <span className="flex-1 bg-gb-ink" />
      <span className="flex w-24 items-stretch justify-end gap-1.5 bg-gb-red px-2 sm:w-32">
        {Array.from({ length: degrees }, (_, i) => (
          <span key={i} className="w-1.5 bg-gb-white" />
        ))}
      </span>
      <span className="w-6 bg-gb-ink sm:w-10" />
    </div>
  );
}
