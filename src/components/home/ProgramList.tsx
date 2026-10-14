import { programs } from '@/data/programs';
import { classColors } from '@/data/schedule';

/** Turmas em formato de lista, como a legenda da grade oficial. */
export function ProgramList() {
  return (
    <dl className="border-t-2 border-gb-ink">
      {programs.map((program) => (
        <div key={program.code} className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 border-b border-gb-line py-5 sm:grid-cols-[10rem_1fr_1.2fr]">
          <dt className="flex items-center gap-3 font-display text-4xl font-bold uppercase text-gb-navy sm:text-5xl">
            <span aria-hidden className={`h-3 w-3 shrink-0 ${classColors[program.code].bg}`} />
            {program.label}
          </dt>
          <dd className="font-display text-2xl font-semibold uppercase leading-tight">{program.audience}</dd>
          <dd className="col-start-2 text-gb-mute sm:col-start-3">{program.description}</dd>
        </div>
      ))}
    </dl>
  );
}
