import type { MuralCategory, MuralPost } from '@/types/mural';

export const muralCategories: { id: MuralCategory; label: string }[] = [
  { id: 'TREINOS', label: 'Treinos' },
  { id: 'GRADUACOES', label: 'Graduações' },
  { id: 'CAMPEONATOS', label: 'Campeonatos' },
  { id: 'EVENTOS', label: 'Eventos' },
  { id: 'COMUNIDADE', label: 'Comunidade' },
];

export const categoryLabel = Object.fromEntries(muralCategories.map((c) => [c.id, c.label])) as Record<MuralCategory, string>;

/**
 * Fotos do mural, da mais recente para a mais antiga. Site estático: para publicar
 * uma foto, salve-a em public/fotos/mural/ (WebP, até 1600 px no maior lado, sem dados de
 * localização) e acrescente um item no início da lista. Só publique com autorização
 * de quem aparece (e dos responsáveis, se houver menores). Para retirar, apague o
 * item e o arquivo.
 *
 * Exemplo de item:
 *   { id: 'graduacao-nov-2026', category: 'GRADUACOES', caption: 'Graduação de novembro',
 *     imageUrl: '/fotos/mural/graduacao-nov-2026.webp', width: 1600, height: 1067 },
 */
export const muralPosts: MuralPost[] = [];
