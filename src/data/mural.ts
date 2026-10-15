import type { MuralCategory } from '@/types/mural';

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
  /** Folga para os outros campos do multipart. */
  maxRequestBytes: 10 * 1024 * 1024 + 256 * 1024,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
  /** Maior imagem que o servidor aceita decodificar (40 megapixels). */
  maxInputPixels: 40_000_000,
  /** Maior lado da cópia privada guardada após o reprocessamento. */
  maxStoredSide: 4000,
  /** Maior lado do derivado público. */
  publicSide: 1600,
  captionMaxLength: 280,
  pageSize: 12,
  maxPageSize: 24,
};

/** Ponto de partida da especificação: 5 envios por hora por origem. */
export const muralRateLimits = {
  submission: { limit: 5, windowMs: 60 * 60 * 1000 },
  removalRequest: { limit: 5, windowMs: 60 * 60 * 1000 },
};
