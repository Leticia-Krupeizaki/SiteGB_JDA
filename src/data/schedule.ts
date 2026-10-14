import type { ClassCode } from './programs';

/**
 * Grade oficial enviada pelo cliente: "Grade Horária, a partir de 26_02_26-1.pdf".
 * Segunda a sexta, 22 blocos (5 + 3 + 6 + 3 + 5). Não há aulas no fim de semana.
 */
export const scheduleValidFrom = '2026-02-26';

export type Weekday = 'seg' | 'ter' | 'qua' | 'qui' | 'sex';

export type ScheduleNote = 'Competição' | 'Defesa pessoal';

export type ScheduleBlock = {
  start: string;
  end: string;
  /** GB1 + GB2 aparecem juntas na arte e são mantidas juntas. */
  classes: ClassCode[];
  note?: ScheduleNote;
};

export const weekdays: { id: Weekday; label: string; short: string; jsDay: number }[] = [
  { id: 'seg', label: 'Segunda-feira', short: 'Seg', jsDay: 1 },
  { id: 'ter', label: 'Terça-feira', short: 'Ter', jsDay: 2 },
  { id: 'qua', label: 'Quarta-feira', short: 'Qua', jsDay: 3 },
  { id: 'qui', label: 'Quinta-feira', short: 'Qui', jsDay: 4 },
  { id: 'sex', label: 'Sexta-feira', short: 'Sex', jsDay: 5 },
];

export const schedule: Record<Weekday, ScheduleBlock[]> = {
  seg: [
    { start: '09:30', end: '10:30', classes: ['GBK'] },
    { start: '12:00', end: '13:00', classes: ['GB1', 'GB2'] },
    { start: '17:30', end: '18:30', classes: ['GB1', 'GB2'], note: 'Competição' },
    { start: '19:00', end: '20:00', classes: ['GBK'] },
    { start: '20:00', end: '21:00', classes: ['GB1', 'GB2'], note: 'Defesa pessoal' },
  ],
  ter: [
    { start: '06:15', end: '07:15', classes: ['GB1', 'GB2'] },
    { start: '18:30', end: '19:30', classes: ['GBF'] },
    { start: '20:00', end: '21:00', classes: ['GB1', 'GB2'] },
  ],
  qua: [
    { start: '06:15', end: '07:15', classes: ['NOGI'] },
    { start: '09:30', end: '10:30', classes: ['GBK'] },
    { start: '12:00', end: '13:00', classes: ['GB1', 'GB2'] },
    { start: '17:30', end: '18:30', classes: ['GB1', 'GB2'], note: 'Competição' },
    { start: '19:00', end: '20:00', classes: ['GBK'] },
    { start: '20:00', end: '21:00', classes: ['NOGI'] },
  ],
  qui: [
    { start: '06:15', end: '07:15', classes: ['GB1', 'GB2'] },
    { start: '18:30', end: '19:30', classes: ['GBF'] },
    { start: '20:00', end: '21:00', classes: ['GB1', 'GB2'] },
  ],
  sex: [
    { start: '09:30', end: '10:30', classes: ['GBK'] },
    { start: '12:00', end: '13:00', classes: ['NOGI'] },
    { start: '17:30', end: '18:30', classes: ['GB1', 'GB2'], note: 'Competição' },
    { start: '19:00', end: '20:00', classes: ['GBK'] },
    { start: '20:00', end: '21:00', classes: ['GB1', 'GB2'] },
  ],
};

const labels: Record<ClassCode, string> = { GBK: 'GBK', GB1: 'GB1', GB2: 'GB2', GBF: 'GBF', NOGI: 'No-Gi' };

export function classLabel(codes: ClassCode[]): string {
  return codes.map((code) => labels[code]).join(' + ');
}

/** Cores auxiliares por turma (Contexto.md). A marca segue vermelho, azul, preto e cinza. */
export const classColors: Record<ClassCode, { bg: string; border: string }> = {
  GBK: { bg: 'bg-green-700', border: 'border-green-700' },
  GB1: { bg: 'bg-blue-600', border: 'border-blue-600' },
  GB2: { bg: 'bg-violet-600', border: 'border-violet-600' },
  GBF: { bg: 'bg-pink-600', border: 'border-pink-600' },
  NOGI: { bg: 'bg-gray-600', border: 'border-gray-600' },
};
