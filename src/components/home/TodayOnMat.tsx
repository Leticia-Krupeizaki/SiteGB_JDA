'use client';

import { useEffect, useState } from 'react';
import { classLabel, schedule, weekdays, type Weekday } from '@/data/schedule';

/**
 * Mostra as aulas do dia atual. No fim de semana (sem aulas na grade),
 * mostra a segunda-feira. Renderiza segunda no servidor e ajusta no navegador.
 */
function pickDay(date: Date): { day: Weekday; isToday: boolean } {
  const match = weekdays.find((w) => w.jsDay === date.getDay());
  return match ? { day: match.id, isToday: true } : { day: 'seg', isToday: false };
}

export function TodayOnMat() {
  const [state, setState] = useState<{ day: Weekday; isToday: boolean }>({ day: 'seg', isToday: false });

  useEffect(() => setState(pickDay(new Date())), []);

  const info = weekdays.find((w) => w.id === state.day)!;

  return (
    <div className="bg-gb-white text-gb-ink">
      <div className="flex items-baseline justify-between gap-4 bg-gb-ink px-5 py-3 text-gb-white">
        <p className="font-display text-xl font-semibold uppercase tracking-wide">
          {state.isToday ? 'Hoje no tatame' : 'Segunda no tatame'}
        </p>
        <p className="text-sm text-gb-line">{info.label}</p>
      </div>
      <ul className="divide-y divide-gb-line px-5">
        {schedule[state.day].map((block) => (
          <li key={`${block.start}-${block.classes.join()}`} className="flex items-baseline gap-4 py-3">
            <span className="w-28 shrink-0 font-display text-xl font-semibold tabular-nums">
              {block.start}–{block.end}
            </span>
            <span className="min-w-0">
              <span className="font-semibold">{classLabel(block.classes)}</span>
              {block.note && <span className="ml-2 text-sm text-gb-red">{block.note}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
