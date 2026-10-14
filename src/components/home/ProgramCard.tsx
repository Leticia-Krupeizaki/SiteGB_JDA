import type { Program } from '@/data/programs';

export function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md">
      <p className="font-display text-4xl font-bold uppercase text-brand-red">{program.label}</p>
      <h3 className="mt-3 text-base font-semibold text-neutral-900">{program.audience}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{program.description}</p>
    </article>
  );
}
