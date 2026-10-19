/**
 * Turmas conforme a legenda da grade oficial (vigente a partir de 10/08/2026).
 * Não acrescentar faixas etárias, durações ou requisitos fora do documento.
 */
export type ClassCode = 'GBK' | 'GB1' | 'GB2' | 'GBF' | 'NOGI';

export type Program = {
  code: ClassCode;
  label: string;
  audience: string;
  description: string;
};

export const programs: Program[] = [
  { code: 'GBK', label: 'GBK', audience: 'Turma para crianças', description: 'Turma infantil de Jiu-Jitsu, com horários para crianças até 6 anos e de 7 a 13 anos.' },
  { code: 'GB1', label: 'GB1', audience: 'Adultos, todos os níveis', description: 'Turma adulta aberta a todos os níveis.' },
  { code: 'GB2', label: 'GB2', audience: 'Adultos, faixa branca 3 graus e acima', description: 'Turma adulta a partir da faixa branca com 3 graus.' },
  { code: 'GBF', label: 'GBF', audience: 'Mulheres', description: 'Turma exclusiva para mulheres.' },
  { code: 'NOGI', label: 'No-Gi', audience: 'Treino sem kimono', description: 'Jiu-Jitsu praticado sem kimono.' },
];

/** Observações que aparecem na grade. São focos de treino, não turmas separadas. */
export const trainingFocuses = [
  { label: 'Competição', description: 'horários de GB1 + GB2 às segundas (17:30) e às quartas e sextas (17:00).' },
  { label: 'Defesa pessoal', description: 'horário de GB1 + GB2 às segundas, às 20:00.' },
] as const;
