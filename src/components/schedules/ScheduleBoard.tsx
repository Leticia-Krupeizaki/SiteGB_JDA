'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { classColors, schedule, scheduleSlots, slotOf, weekdays, type Weekday } from '@/data/schedule';
import { useMediaQuery, wideQuery } from '@/lib/hooks/useMediaQuery';
import { academyTimeZone, defaultDay, filterBlocks, filterGroups, type FilterGroup } from '@/lib/schedule';
import { ScheduleClassCard } from './ScheduleClassCard';

/**
 * Faixa de horário sem aula. Fica visível (pedido do cliente) para a grade manter
 * as linhas alinhadas e o aluno não se perder. No computador é só o espaço
 * tracejado; no celular, uma linha curta com o horário.
 */
function EmptySlot({ slot }: { slot: string }) {
  return (
    <div className="flex h-full min-h-10 items-center border border-dashed border-gb-gray-45/50 px-4 py-2 text-sm text-gb-mute lg:min-h-24">
      <span className="lg:sr-only">
        <span className="font-semibold tabular-nums">{slot}</span> · sem aula neste horário
      </span>
    </div>
  );
}

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

      {/*
       * Computador: 5 colunas e uma linha por faixa de horário (scheduleSlots), como na
       * arte oficial. Os dias usam subgrid, então cada faixa tem a mesma altura em
       * todas as colunas e o espaço vazio marca "sem aula naquele horário".
       * Os números de linhas (8 faixas; 9 com o título) acompanham scheduleSlots:
       * ao mudar as faixas, ajustar aqui (o Tailwind precisa das classes fixas).
       */}
      <div className="mt-6 grid gap-6 lg:mt-10 lg:grid-cols-5 lg:grid-rows-[auto_repeat(8,auto)] lg:gap-x-4 lg:gap-y-3">
        {weekdays.map((w) => {
          const blocks = filterBlocks(schedule[w.id], active);
          return (
            <section
              key={w.id}
              id={`painel-${w.id}`}
              {...(isWide ? {} : { role: 'tabpanel', 'aria-labelledby': `tab-${w.id}` })}
              className={`${w.id === day ? 'block' : 'hidden'} lg:row-span-9 lg:grid lg:grid-rows-subgrid`}
            >
              <h2 className="font-display text-2xl font-bold uppercase lg:border-b-2 lg:border-gb-ink lg:pb-2">{w.label}</h2>
              {blocks.length === 0 && (
                <p className="mt-4 border border-dashed border-gb-mute/40 p-4 text-sm text-gb-mute lg:hidden">Sem aulas da turma selecionada neste dia.</p>
              )}
              <ul className={`mt-4 space-y-3 lg:row-span-8 lg:mt-0 lg:grid lg:grid-rows-subgrid lg:space-y-0 ${blocks.length === 0 ? 'max-lg:hidden' : ''}`}>
                {scheduleSlots.map((slot) => {
                  const block = blocks.find((b) => slotOf(b.start) === slot);
                  // No celular, some o "sem aula" de uma faixa em que outra aula do dia ainda está
                  // acontecendo (ex.: 17:30 na terça, durante a aula das 17:00–18:00).
                  const covered = !block && blocks.some((b) => b.start < slot && slot < b.end);
                  return (
                    <li key={slot} className={`lg:h-full ${covered ? 'max-lg:hidden' : ''}`}>
                      {block ? <ScheduleClassCard block={block} dayLabel={w.label} /> : <EmptySlot slot={slot} />}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
