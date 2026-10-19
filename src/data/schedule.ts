import type { ClassCode } from './programs';

/**
 * Grade oficial enviada pelo cliente: "Grade Horária, 10_08_2026.pdf" (a partir de 10/08/2026).
 * Segunda a sexta, 27 blocos (5 + 5 + 7 + 5 + 5). Não há aulas no fim de semana.
 */
export const scheduleValidFrom = '2026-08-10';

/** Aviso que acompanha a grade oficial. */
export const scheduleDisclaimer = 'Sujeito a alterações. Acompanhe a versão atualizada no nosso Instagram';

export type Weekday = 'seg' | 'ter' | 'qua' | 'qui' | 'sex';

export type ScheduleNote = 'Competição' | 'Defesa pessoal';

export type ScheduleBlock = {
  start: string;
  end: string;
  /** GB1 + GB2 aparecem juntas na arte e são mantidas juntas. */
  classes: ClassCode[];
  note?: ScheduleNote;
  /** Faixa etária indicada na arte (só nas turmas GBK). */
  ageGroup?: 'Até 6 anos' | '7 a 13 anos';
};

export const weekdays: { id: Weekday; label: string; short: string; jsDay: number }[] = [
  { id: 'seg', label: 'Segunda-feira', short: 'Seg', jsDay: 1 },
  { id: 'ter', label: 'Terça-feira', short: 'Ter', jsDay: 2 },
  { id: 'qua', label: 'Quarta-feira', short: 'Qua', jsDay: 3 },
  { id: 'qui', label: 'Quinta-feira', short: 'Qui', jsDay: 4 },
  { id: 'sex', label: 'Sexta-feira', short: 'Sex', jsDay: 5 },
];

/**
 * Faixas de horário da arte oficial. Na grade, cada faixa é uma linha: dias sem
 * aula naquela faixa ficam com o espaço vazio, para o aluno não se perder
 * (pedido do cliente). Um bloco entra na última faixa que começa até o seu
 * início (ex.: segunda 17:30 fica na faixa das 17:00, como na arte).
 */
export const scheduleSlots = ['06:15', '09:30', '12:00', '17:00', '18:00', '19:00', '20:00'] as const;

export type ScheduleSlot = (typeof scheduleSlots)[number];

export function slotOf(start: string): ScheduleSlot {
  return [...scheduleSlots].reverse().find((slot) => slot <= start) ?? scheduleSlots[0];
}

export const schedule: Record<Weekday, ScheduleBlock[]> = {
  seg: [
    { start: '09:30', end: '10:30', classes: ['GBK'] },
    { start: '12:00', end: '13:00', classes: ['GB1', 'GB2'] },
    { start: '17:30', end: '18:30', classes: ['GB1', 'GB2'], note: 'Competição' },
    { start: '19:00', end: '19:50', classes: ['GBK'], ageGroup: '7 a 13 anos' },
    { start: '20:00', end: '21:00', classes: ['GB1', 'GB2'], note: 'Defesa pessoal' },
  ],
  ter: [
    { start: '06:15', end: '07:15', classes: ['GB1', 'GB2'] },
    { start: '17:00', end: '18:00', classes: ['GB1', 'GB2'] },
    { start: '18:00', end: '18:50', classes: ['GBK'], ageGroup: 'Até 6 anos' },
    { start: '19:00', end: '20:00', classes: ['GBF'] },
    { start: '20:00', end: '21:00', classes: ['GB1', 'GB2'] },
  ],
  qua: [
    { start: '06:15', end: '07:15', classes: ['NOGI'] },
    { start: '09:30', end: '10:30', classes: ['GBK'] },
    { start: '12:00', end: '13:00', classes: ['GB1', 'GB2'] },
    { start: '17:00', end: '18:00', classes: ['GB1', 'GB2'], note: 'Competição' },
    { start: '18:00', end: '18:50', classes: ['GBK'], ageGroup: 'Até 6 anos' },
    { start: '19:00', end: '19:50', classes: ['GBK'], ageGroup: '7 a 13 anos' },
    { start: '20:00', end: '21:00', classes: ['NOGI'] },
  ],
  qui: [
    { start: '06:15', end: '07:15', classes: ['GB1', 'GB2'] },
    { start: '17:00', end: '18:00', classes: ['NOGI'] },
    { start: '18:00', end: '18:50', classes: ['GBK'], ageGroup: 'Até 6 anos' },
    { start: '19:00', end: '20:00', classes: ['GBF'] },
    { start: '20:00', end: '21:00', classes: ['GB1', 'GB2'] },
  ],
  sex: [
    { start: '09:30', end: '10:30', classes: ['GBK'] },
    { start: '12:00', end: '13:00', classes: ['NOGI'] },
    { start: '17:00', end: '18:00', classes: ['GB1', 'GB2'], note: 'Competição' },
    { start: '19:00', end: '19:50', classes: ['GBK'], ageGroup: '7 a 13 anos' },
    { start: '20:00', end: '21:00', classes: ['GB1', 'GB2'] },
  ],
};

const labels: Record<ClassCode, string> = { GBK: 'GBK', GB1: 'GB1', GB2: 'GB2', GBF: 'GBF', NOGI: 'No-Gi' };

export function classLabel(codes: ClassCode[]): string {
  return codes.map((code) => labels[code]).join(' + ');
}

/**
 * Cores auxiliares por turma (Contexto.md), só para diferenciar turmas na grade.
 * Azul e cinza usam a paleta oficial. Verde, roxo e rosa NÃO constam do manual
 * da marca: pendente de confirmação (docs/IDENTIDADE-VISUAL.md).
 */
export const classColors: Record<ClassCode, { bg: string; border: string }> = {
  GBK: { bg: 'bg-green-700', border: 'border-green-700' },
  GB1: { bg: 'bg-gb-blue', border: 'border-gb-blue' },
  GB2: { bg: 'bg-violet-600', border: 'border-violet-600' },
  GBF: { bg: 'bg-pink-600', border: 'border-pink-600' },
  NOGI: { bg: 'bg-gb-gray-65', border: 'border-gb-gray-65' },
};
