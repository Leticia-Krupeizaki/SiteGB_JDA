import type { StaticImageData } from 'next/image';

/**
 * Legado Gracie Barra e "Mural do Legado", com base em graciebarra.com/brasil/sobre-nos
 * (consultado em 21/10/2026). Textos próprios, a partir dos fatos da página oficial;
 * passar pela aprovação do cliente.
 *
 * FOTOS: não usar imagens da internet. O Manual da Marca (p. 19) proíbe usar a imagem
 * do Mestre Carlos Gracie Sr. e do Mestre Carlos Gracie Jr. sem autorização prévia
 * POR ESCRITO do franqueador. Retratos só com arquivos oficiais + autorização.
 */
export const legacySourceUrl = 'https://graciebarra.com/brasil/sobre-nos/';

export const legacy = {
  title: 'O legado Gracie Barra',
  intro: [
    'Desde 1986, a Gracie Barra transforma vidas por meio do Jiu-Jitsu. Fundada pelo Mestre Carlos Gracie Jr., a equipe cresceu de uma única escola para mais de mil escolas em todo o mundo, unidas pelo mesmo método de ensino, do primeiro dia de aula até a faixa-preta.',
    'Cada escola Gracie Barra carrega uma linhagem que começa muito antes de 1986: são gerações de mestres que trouxeram, desenvolveram e espalharam o Jiu-Jitsu pelo mundo.',
  ],
  pillars: [
    { label: 'Missão', text: 'Jiu-Jitsu Para Todos®' },
    { label: 'Visão', text: 'Uma escola em cada comunidade do mundo' },
    { label: 'Valores', text: 'Irmandade, Integridade e Desenvolvimento' },
  ],
};

export type LegacyMaster = {
  name: string;
  role: string;
  /** Retrato oficial. Pendente (ver aviso no topo do arquivo). */
  photo: null | { src: StaticImageData; alt: string };
  /** true: o manual exige autorização por escrito do franqueador para usar a imagem. */
  requiresWrittenAuthorization?: boolean;
};

/** Mural do Legado, na ordem da página oficial (linhagem). */
export const legacyWall: LegacyMaster[] = [
  { name: 'Mitsuyo Maeda', role: 'Mestre japonês, um dos grandes responsáveis por trazer o Jiu-Jitsu ao Brasil.', photo: null },
  {
    name: 'Carlos Gracie Sr.',
    role: 'Pioneiro do Jiu-Jitsu Brasileiro, dedicou-se a desenvolver e difundir a arte.',
    photo: null,
    requiresWrittenAuthorization: true,
  },
  { name: 'Hélio Gracie', role: 'Pioneiro do Jiu-Jitsu Brasileiro, dedicou a vida ao aperfeiçoamento da técnica.', photo: null },
  { name: 'Rolls Gracie', role: 'Inovador da sua geração, levou ao Jiu-Jitsu uma abordagem moderna e atlética.', photo: null },
  {
    name: 'Carlos Gracie Jr.',
    role: 'Fundador da Gracie Barra, transformou o Jiu-Jitsu Para Todos em um movimento global.',
    photo: null,
    requiresWrittenAuthorization: true,
  },
];
