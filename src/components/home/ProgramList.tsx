import { programs } from '@/data/programs';

/** Turmas em formato de lista, como a legenda da grade oficial. */
export function ProgramList() {
  return (
    <dl className="border-t-2 border-gb-ink">
      {programs.map((program) => (
        <div key={program.code} className="grid grid-cols-[6rem_1fr] items-baseline gap-4 border-b border-gb-line py-5 sm:grid-cols-[9rem_1fr_1.2fr]">
          <dt className="font-display text-4xl font-bold uppercase text-gb-navy sm:text-5xl">{program.label}</dt>
          <dd className="font-display text-2xl font-semibold uppercase leading-tight">{program.audience}</dd>
          <dd className="col-start-2 text-gb-mute sm:col-start-3">{program.description}</dd>
        </div>
      ))}
    </dl>
  );
}
