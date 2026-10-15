'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { classColors, schedule, weekdays, type Weekday } from '@/data/schedule';
import { useMediaQuery, wideQuery } from '@/lib/hooks/useMediaQuery';
import { academyTimeZone, defaultDay, filterBlocks, filterGroups, type FilterGroup } from '@/lib/schedule';
import { ScheduleClassCard } from './ScheduleClassCard';

/**
 * Grade semanal. No celular, abas por dia (abre no dia atual). A partir de
 * telas largas, a semana inteira em colunas, sem papéis de aba. Os filtros valem para as duas.
 */
export function ScheduleBoard({ initialDay }: { initialDay: Weekday }) {
  const [day, setDay] = useState<Weekday>(initialDay);
  const [active, setActive] = useState<FilterGroup[]>([]);
  const tabRefs = useRef<Record<Weekday, HTMLButtonElement | null>>({ seg: null, ter: null, qua: null, qui: null, sex: null });
  // Abas só existem abaixo de `lg`.
  const isWide = useMediaQuery(wideQuery);

  // Corrige só se a página em cache tiver virado o dia.
  useEffect(() => setDay(defaultDay(new Date(), academyTimeZone).day), []);

  const toggle = (id: FilterGroup) =>
    setActive((current) => (current.includes(id) ? current.filter((g) => g !== id) : [...current, id]));

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = weekdays[(index + delta + weekdays.length) % weekdays.length].id;
    setDay(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <fieldset>
        <legend className="font-display text-lg font-semibold uppercase tracking-wide">Filtrar por turma</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {filterGroups.map((group) => {
            const pressed = active.includes(group.id);
            return (
              <button
                key={group.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => toggle(group.id)}
                className={`focus-ring flex min-h-11 items-center gap-2 border-2 px-3 text-sm font-semibold transition-colors ${
                  pressed ? 'border-gb-ink bg-gb-ink text-gb-white' : 'border-gb-line bg-gb-white text-gb-ink hover:border-gb-ink'
                }`}
              >
                <span aria-hidden className={`h-3 w-3 ${classColors[group.codes[0]].bg}`} />
                {group.label}
              </button>
            );
          })}
          {active.length > 0 && (
            <button type="button" onClick={() => setActive([])} className="focus-ring min-h-11 px-3 text-sm font-semibold text-gb-navy underline">
              Mostrar todas
            </button>
          )}
        </div>
      </fieldset>

      {/* Abas por dia: só no celular e tablet */}
      <div role="tablist" aria-label="Dias da semana" className="mt-8 grid grid-cols-5 border-b-2 border-gb-ink lg:hidden">
        {weekdays.map((w, index) => {
          const selected = w.id === day;
          return (
            <button
              key={w.id}
              ref={(el) => {
                tabRefs.current[w.id] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${w.id}`}
              aria-selected={selected}
              aria-controls={`painel-${w.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setDay(w.id)}
              onKeyDown={(event) => onTabKey(event, index)}
              className={`focus-ring min-h-12 font-display text-xl font-semibold uppercase transition-colors ${
                selected ? 'bg-gb-ink text-gb-white' : 'text-gb-ink hover:bg-gb-line'
              }`}
            >
              {w.short}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:mt-10 lg:grid-cols-5 lg:gap-4">
        {weekdays.map((w) => {
          const blocks = filterBlocks(schedule[w.id], active);
          return (
            <section
              key={w.id}
              id={`painel-${w.id}`}
              {...(isWide ? {} : { role: 'tabpanel', 'aria-labelledby': `tab-${w.id}` })}
              className={`${w.id === day ? 'block' : 'hidden'} lg:block`}
            >
              <h2 className="font-display text-2xl font-bold uppercase lg:border-b-2 lg:border-gb-ink lg:pb-2">{w.label}</h2>
              {blocks.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {blocks.map((block) => (
                    <li key={`${block.start}-${block.classes.join()}`}>
                      <ScheduleClassCard block={block} dayLabel={w.label} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 border border-dashed border-gb-mute/40 p-4 text-sm text-gb-mute">Sem aulas da turma selecionada neste dia.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
