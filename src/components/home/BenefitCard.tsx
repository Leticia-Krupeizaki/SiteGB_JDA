export function BenefitCard({ index, title, description }: { index: number; title: string; description: string }) {
  return (
    <div className="border-t-4 border-brand-red bg-white p-6">
      <p className="font-display text-sm font-semibold text-neutral-600">{String(index).padStart(2, '0')}</p>
      <h3 className="mt-2 font-display text-2xl font-semibold uppercase break-words xl:text-xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">{description}</p>
    </div>
  );
}
