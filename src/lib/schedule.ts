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

/** Dia corrente quando há aulas; no fim de semana, segunda-feira. */
export function defaultDay(date: Date): { day: Weekday; isToday: boolean } {
  const match = weekdays.find((w) => w.jsDay === date.getDay());
  return match ? { day: match.id, isToday: true } : { day: 'seg', isToday: false };
}
