import type { StaticImageData } from 'next/image';
import schoolLogo from '@/assets/marca/logo-escola-jda.png';
import premiumSeal from '@/assets/selo-escola-premium-2026.jpg';
import { site } from '@/config/site';
import { history } from './history';
import { instructors } from './instructors';
import { legacyWall } from './legacy';

/**
 * Espaços de foto do site que o administrador troca pelo painel (/admin/fotos).
 * `default` é a imagem do código, usada enquanto não houver troca (ou depois de
 * "voltar ao padrão"); `null` mostra o quadro "a definir". A foto enviada fica no
 * bucket público e vale no lugar do padrão (ver src/lib/content/site-images.ts).
 */
export type SiteImageSlot = {
  key: string;
  /** Agrupa os espaços no painel (página do site). */
  group: string;
  label: string;
  /** Orientação para quem vai enviar: formato, enquadramento. */
  hint: string;
  /** Maior lado do arquivo publicado, em px. */
  maxSide: number;
  default: null | { src: StaticImageData; alt: string };
  /** Sugestão de texto alternativo quando não há imagem padrão. */
  suggestedAlt?: string;
};

export const siteImageSlots: SiteImageSlot[] = [
  {
    key: 'home-hero',
    group: 'Página inicial',
    label: 'Fundo do topo',
    hint: 'Foto de treino na horizontal. Aparece em preto e branco e escurecida atrás do título.',
    maxSide: 2400,
    default: null,
    suggestedAlt: 'Treino de Jiu-Jitsu no tatame da academia',
  },
  {
    key: 'home-unidade',
    group: 'Página inicial',
    label: 'Foto da unidade',
    hint: 'Seção "Somos…". Cortada no formato 4:3 (horizontal).',
    maxSide: 1600,
    default: null,
    suggestedAlt: 'Tatame da Gracie Barra Jardim das Américas',
  },
  {
    key: 'sobre-historia',
    group: 'A academia',
    label: 'Nossa história',
    hint: 'Foto ao lado do texto da história. Vertical fica melhor.',
    maxSide: 1600,
    default: history.photo,
  },
  ...[1, 2, 3].map((n) => ({
    key: `sobre-estrutura-${n}`,
    group: 'A academia',
    label: `Estrutura · foto ${n}`,
    hint: 'Fotos do espaço. Cortadas no formato 4:3; aparecem lado a lado.',
    maxSide: 1600,
    default: null,
    suggestedAlt: 'Espaço da academia',
  })),
  {
    key: 'programas-alem-do-tatame',
    group: 'Programas',
    label: 'Muito além do tatame',
    hint: 'Foto abaixo do título "Muito além do tatame". Cortada no formato 4:3 (horizontal).',
    maxSide: 1600,
    default: null,
    suggestedAlt: 'Alunos da Gracie Barra Jardim das Américas no tatame',
  },
  ...instructors.map((instructor) => ({
    key: `professor-${instructor.id}`,
    group: 'Professores',
    label: instructor.name,
    hint: 'Retrato vertical (formato 3:4), de preferência de kimono.',
    maxSide: 1200,
    default: null,
    suggestedAlt: `Foto de ${instructor.name}`,
  })),
  ...legacyWall.map((master) => ({
    key: `legado-${master.id}`,
    group: 'Mural do Legado',
    label: master.name,
    hint: 'Retrato quadrado ou vertical; aparece cortado no formato 4:5, centralizado.',
    maxSide: 800,
    default: master.photo,
    suggestedAlt: `Retrato de ${master.name}`,
  })),
  {
    key: 'marca-selo-premium',
    group: 'Marca',
    label: 'Selo Escola Premium',
    hint: 'Topo da página inicial e rodapé, sobre fundo preto. Use o arquivo oficial do ano, quadrado.',
    maxSide: 600,
    default: { src: premiumSeal, alt: 'Selo Escola Premium Gracie Barra, certificação 2026' },
  },
  {
    key: 'marca-logo-escola',
    group: 'Marca',
    label: 'Logo da escola',
    hint: 'Topo da página inicial (marca d’água à esquerda) e rodapé. Quadrado; aparece sobre fundo preto.',
    maxSide: 600,
    default: { src: schoolLogo, alt: `Logo ${site.name}: Jiu-Jitsu & Defesa Pessoal, Jardim das Américas, Curitiba, PR` },
  },
];

export const siteImageSlotByKey = new Map(siteImageSlots.map((slot) => [slot.key, slot]));
