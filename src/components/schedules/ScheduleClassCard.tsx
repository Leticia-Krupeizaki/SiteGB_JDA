import { site, whatsappUrl } from '@/config/site';
import { programs } from '@/data/programs';
import { classColors, classLabel, type ScheduleBlock } from '@/data/schedule';

const audience = Object.fromEntries(programs.map((p) => [p.code, p.audience]));

export function ScheduleClassCard({ block, dayLabel }: { block: ScheduleBlock; dayLabel: string }) {
  const label = classLabel(block.classes);
  const question = whatsappUrl(
    `Olá! Tenho uma dúvida sobre a turma ${label} de ${dayLabel.toLowerCase()}, das ${block.start} às ${block.end}, na ${site.name}.`,
  );

  return (
    <article className={`border-l-4 bg-gb-white p-4 ${classColors[block.classes[0]].border}`}>
      <p className="font-display text-2xl font-bold tabular-nums">
        {block.start}
        <span className="text-gb-mute">–{block.end}</span>
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Turmas">
        {block.classes.map((code) => (
          <li key={code} className={`px-2 py-0.5 text-sm font-semibold text-gb-white ${classColors[code].bg}`}>
            {classLabel([code])}
            <span className="sr-only">: {audience[code]}</span>
          </li>
        ))}
      </ul>
      {block.note && <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-gb-red">{block.note}</p>}
      <a
        href={question}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring mt-3 inline-block text-sm text-gb-navy underline underline-offset-2 hover:text-gb-red"
      >
        Tirar dúvidas sobre esta turma
        <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
      </a>
    </article>
  );
}
