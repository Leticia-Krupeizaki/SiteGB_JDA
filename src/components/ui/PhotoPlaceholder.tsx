/**
 * Espaço reservado para fotografia oficial. Nunca substituir por foto genérica
 * apresentada como se fosse da unidade.
 */
export function PhotoPlaceholder({ label = 'Foto oficial a definir', className = '' }: { label?: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex items-end overflow-hidden bg-gb-ink bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_10px)] ${className}`}
    >
      <span className="m-4 border border-dashed border-gb-line/50 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gb-line">
        {label}
      </span>
    </div>
  );
}
