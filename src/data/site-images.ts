import type { StaticImageData } from 'next/image';
import schoolLogo from '@/assets/marca/logo-escola-jda.png';
import premiumSeal from '@/assets/selo-escola-premium-2026.jpg';
import { site } from '@/config/site';
import { history } from './history';
import { instructors } from './instructors';
import { legacyWall } from './legacy';

/**
 * Espaços de foto do site. `image: null` mostra o quadro "Foto a definir".
 *
 * Para colocar ou trocar uma foto: salve o arquivo em src/assets/ (JPG ou WebP,
 * no tamanho indicado em `hint`), importe-o no topo deste arquivo e preencha
 * `image` com `{ src: <import>, alt: '<descrição da foto>' }`.
 */
export type SiteImageSlot = {
  key: string;
  /** Onde aparece e qual formato usar. */
  hint: string;
  image: null | { src: StaticImageData; alt: string };
};

export const siteImageSlots: SiteImageSlot[] = [
  {
    key: 'home-hero',
    hint: 'Página inicial, fundo do topo. Foto de treino na horizontal (até 2400 px); aparece em preto e branco e escurecida atrás do título.',
    image: null,
  },
  {
    key: 'home-unidade',
    hint: 'Página inicial, seção "Somos…". Horizontal, cortada em 4:3 (até 1600 px).',
    image: null,
  },
  {
    key: 'sobre-historia',
    hint: 'A academia, ao lado do texto da história. Vertical fica melhor (até 1600 px).',
    image: history.photo,
  },
  ...[1, 2, 3].map((n) => ({
    key: `sobre-estrutura-${n}`,
    hint: `A academia, Estrutura (foto ${n}). Fotos do espaço, cortadas em 4:3, lado a lado (até 1600 px).`,
    image: null,
  })),
  {
    key: 'programas-alem-do-tatame',
    hint: 'Programas, abaixo de "Muito além do tatame". Horizontal, cortada em 4:3 (até 1600 px).',
    image: null,
  },
  ...instructors.map((instructor) => ({
    key: `professor-${instructor.id}`,
    hint: `Professores, ${instructor.name}. Retrato vertical, de preferência de kimono, com o professor centralizado (até 1200 px).`,
    image: null,
  })),
  ...legacyWall.map((master) => ({
    key: `legado-${master.id}`,
    hint: `Mural do Legado, ${master.name}. Quadrado ou vertical; aparece cortado em 4:5, centralizado (até 800 px).`,
    image: master.photo,
  })),
  {
    key: 'marca-selo-premium',
    hint: 'Topo da página inicial e rodapé, sobre fundo preto. Arquivo oficial do ano, quadrado.',
    image: { src: premiumSeal, alt: 'Selo Escola Premium Gracie Barra, certificação 2026' },
  },
  {
    key: 'marca-logo-escola',
    hint: 'Topo da página inicial (marca d’água) e rodapé, sobre fundo preto. Quadrado.',
    image: { src: schoolLogo, alt: `Logo ${site.name}: Jiu-Jitsu & Defesa Pessoal, Jardim das Américas, Curitiba, PR` },
  },
];
