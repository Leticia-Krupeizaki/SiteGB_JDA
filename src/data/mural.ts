import type { MuralCategory, PublicMuralPost } from '@/types/mural';

export const muralCategories: { id: MuralCategory; label: string }[] = [
  { id: 'TREINOS', label: 'Treinos' },
  { id: 'GRADUACOES', label: 'Graduações' },
  { id: 'CAMPEONATOS', label: 'Campeonatos' },
  { id: 'EVENTOS', label: 'Eventos' },
  { id: 'COMUNIDADE', label: 'Comunidade' },
];

export const categoryLabel = Object.fromEntries(muralCategories.map((c) => [c.id, c.label])) as Record<MuralCategory, string>;

/** Versões dos textos legais aceitos no envio. Atualizar quando o cliente aprovar os textos finais. */
export const muralPolicyVersions = {
  privacy: 'rascunho-2026-10',
  publicationConsent: 'rascunho-2026-10',
} as const;

export const muralLimits = {
  maxFileBytes: 10 * 1024 * 1024,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
  captionMaxLength: 280,
  pageSize: 9,
};

/**
 * Itens de DEMONSTRAÇÃO, sem foto. Servem só para mostrar o layout da galeria
 * até existir o backend com fotos aprovadas. Não representam alunos reais.
 */
export const demoMuralPosts: PublicMuralPost[] = (
  [
    ['TREINOS', 4 / 3],
    ['GRADUACOES', 3 / 4],
    ['CAMPEONATOS', 1],
    ['EVENTOS', 16 / 9],
    ['COMUNIDADE', 4 / 5],
    ['TREINOS', 3 / 4],
    ['GRADUACOES', 4 / 3],
    ['CAMPEONATOS', 4 / 5],
    ['TREINOS', 1],
    ['EVENTOS', 3 / 4],
    ['COMUNIDADE', 4 / 3],
    ['TREINOS', 16 / 9],
    ['GRADUACOES', 1],
    ['CAMPEONATOS', 4 / 3],
  ] as const
).map(([category, aspectRatio], i) => ({ id: `demo-${i + 1}`, category, aspectRatio }));
