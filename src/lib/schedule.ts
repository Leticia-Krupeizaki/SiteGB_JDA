import type { ClassCode } from '@/data/programs';
import { weekdays, type ScheduleBlock, type Weekday } from '@/data/schedule';

/** Grupos de filtro. GB1 e GB2 dividem o mesmo horário na grade, então filtram juntos. */
export type FilterGroup = 'GBK' | 'GB1GB2' | 'GBF' | 'NOGI';

export const filterGroups: { id: FilterGroup; label: string; codes: ClassCode[] }[] = [
  { id: 'GBK', label: 'GBK · Infantil', codes: ['GBK'] },
  { id: 'GB1GB2', label: 'GB1 / GB2 · Adultos', codes: ['GB1', 'GB2'] },
  { id: 'GBF', label: 'GBF · Feminino', codes: ['GBF'] },
  { id: 'NOGI', label: 'No-Gi · Sem kimono', codes: ['NOGI'] },
];

/**
 * Filtra sem alterar a grade original. Sem filtro ativo, mostra tudo.
 * Um bloco aparece se tiver qualquer turma de um grupo ativo.
 */
export function filterBlocks(blocks: ScheduleBlock[], active: FilterGroup[]): ScheduleBlock[] {
  if (active.length === 0) return blocks;
  const codes = new Set(filterGroups.filter((g) => active.includes(g.id)).flatMap((g) => g.codes));
  return blocks.filter((block) => block.classes.some((code) => codes.has(code)));
}

/** Fuso da academia. Usado para calcular o dia no servidor, que pode rodar em UTC. */
export const academyTimeZone = 'America/Sao_Paulo';

const jsDayByName: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Dia da semana (0 = domingo) no fuso informado; sem fuso, usa o horário local. */
// Sem a forma abreviada `{ timeZone }`: o minificador do Next 15.5 a quebra ao embutir esta função.
function jsDayIn(date: Date, zone?: string): number {
  if (!zone) return date.getDay();
  const name = new Intl.DateTimeFormat('en-US', { timeZone: zone, weekday: 'short' }).format(date);
  return jsDayByName[name];
}

/** Dia corrente quando há aulas; no fim de semana, segunda-feira. */
export function defaultDay(date: Date, timeZone?: string): { day: Weekday; isToday: boolean } {
  const jsDay = jsDayIn(date, timeZone);
  const match = weekdays.find((w) => w.jsDay === jsDay);
  return match ? { day: match.id, isToday: true } : { day: 'seg', isToday: false };
}
