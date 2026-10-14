/**
 * Turmas conforme a legenda da grade oficial (vigente a partir de 26/02/2026).
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
  {
    code: 'GBK',
    label: 'GBK',
    audience: 'Crianças de 03 a 15 anos',
    description: 'Turma infantil de Jiu-Jitsu.',
  },
  {
    code: 'GB1',
    label: 'GB1',
    audience: 'Adultos, todos os níveis',
    description: 'Turma adulta aberta a todos os níveis.',
  },
  {
    code: 'GB2',
    label: 'GB2',
    audience: 'Adultos, faixa branca 3 graus e acima',
    description: 'Turma adulta para alunos a partir da faixa branca com 3 graus.',
  },
  {
    code: 'GBF',
    label: 'GBF',
    audience: 'Mulheres',
    description: 'Turma exclusiva para mulheres.',
  },
  {
    code: 'NOGI',
    label: 'No-Gi',
    audience: 'Treino sem kimono',
    description: 'Treino de Jiu-Jitsu sem kimono.',
  },
];

/** Observações que aparecem na grade. São focos de treino, não turmas separadas. */
export const trainingFocuses = [
  { label: 'Competição', description: 'Treinos com foco em competição, nas turmas GB1 + GB2.' },
  { label: 'Defesa pessoal', description: 'Treino com foco em defesa pessoal, nas turmas GB1 + GB2.' },
] as const;
