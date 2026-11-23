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
 * A primeira foto veio do mural antigo (aprovada no painel em 2026), em 23/11/2026.
 */
export const muralPosts: MuralPost[] = [
  {
    id: 'comunidade-leticia',
    category: 'COMUNIDADE',
    studentName: 'Leticia',
    imageUrl: '/fotos/mural/comunidade-leticia.webp',
    width: 631,
    height: 644,
  },
];
