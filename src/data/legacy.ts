import type { StaticImageData } from 'next/image';
import carlosGracieJr from '@/assets/legado/carlos-gracie-jr.png';
import carlosGracieSr from '@/assets/legado/carlos-gracie-sr.png';
import helioGracie from '@/assets/legado/helio-gracie.png';
import mitsuyoMaeda from '@/assets/legado/mitsuyo-maeda.png';
import rollsGracie from '@/assets/legado/rolls-gracie.png';

/**
 * Legado Gracie Barra e "Mural do Legado", com base em graciebarra.com/brasil/sobre-nos
 * (consultado em 21/10/2026). Textos próprios, a partir dos fatos da página oficial;
 * passar pela aprovação do cliente.
 *
 * FOTOS: retratos oficiais do Mural do Legado, baixados da mesma página (originais
 * sem edição em assets/marca/legado/). Uso liberado pelo cliente em 21/10/2026, como
 * escola autorizada da GB. O Manual da Marca (p. 19) pede autorização POR ESCRITO do
 * franqueador para a imagem de Carlos Gracie Sr. e Jr.: o cliente deve guardar esse
 * documento.
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
  /** Usado na chave da foto no painel (`legado-<id>`). */
  id: string;
  name: string;
  /** Sempre visível abaixo do nome, na linha do tempo. */
  subtitle: string;
  /** Título e breve história que surgem sobre a foto (hover ou toque). */
  headline: string;
  summary: string;
  /** Retrato oficial do Mural do Legado (ver aviso no topo do arquivo). */
  photo: null | { src: StaticImageData; alt: string };
  /** true: o manual exige autorização por escrito do franqueador para usar a imagem. */
  requiresWrittenAuthorization?: boolean;
};

/**
 * Linha do tempo do Legado, na ordem da linhagem. Breves histórias resumidas dos
 * textos enviados pelo cliente em 09/11/2026 (pediu menos texto na página).
 */
export const legacyWall: LegacyMaster[] = [
  {
    id: 'mitsuyo-maeda',
    name: 'Mitsuyo Maeda',
    subtitle: 'O início de um grande legado',
    headline: 'O início de um grande legado',
    summary:
      'Conhecido como Conde Koma, o mestre japonês chegou ao Brasil em 1914 e ensinou Carlos Gracie, dando início a uma tradição de disciplina, respeito, coragem e superação.',
    photo: { src: mitsuyoMaeda, alt: 'Retrato em preto e branco de Mitsuyo Maeda, de kimono' },
  },
  {
    id: 'carlos-gracie-sr',
    name: 'Carlos Gracie Sr.',
    subtitle: 'Uma filosofia de vida',
    headline: 'O Jiu-Jitsu como filosofia de vida',
    summary:
      'Discípulo de Maeda, transformou os ensinamentos em uma filosofia de vida e acreditava que o Jiu-Jitsu deveria ser acessível a todos. Seu legado inspirou o filho, Carlos Gracie Jr.',
    photo: { src: carlosGracieSr, alt: 'Retrato em preto e branco do Mestre Carlos Gracie Sr.' },
    requiresWrittenAuthorization: true,
  },
  {
    id: 'helio-gracie',
    name: 'Hélio Gracie',
    subtitle: 'A técnica supera a força',
    headline: 'A força da superação',
    summary:
      'Mesmo com dificuldades físicas desde a infância, provou que a técnica pode superar a força e revolucionou o Jiu-Jitsu Brasileiro com coragem, inteligência e perseverança.',
    photo: { src: helioGracie, alt: 'Retrato em preto e branco de Hélio Gracie, de kimono' },
  },
  {
    id: 'rolls-gracie',
    name: 'Rolls Gracie',
    subtitle: 'A coragem de inovar',
    headline: 'Um verdadeiro visionário',
    summary:
      'Visionário, integrou conhecimentos de outras artes marciais e mostrou que respeitar a tradição também é ter coragem para inovar. Influenciou profundamente Carlos Gracie Jr.',
    photo: { src: rollsGracie, alt: 'Retrato em preto e branco de Rolls Gracie, de kimono' },
  },
  {
    id: 'carlos-gracie-jr',
    name: 'Carlos Gracie Jr.',
    subtitle: 'Fundador da Gracie Barra',
    headline: 'O visionário que transformou o Jiu-Jitsu em um legado mundial',
    summary:
      'Fundador da Gracie Barra, levou o “Jiu-Jitsu para Todos” a mais de 40 países, com uma metodologia que acolhe pessoas de todas as idades e níveis de experiência.',
    photo: { src: carlosGracieJr, alt: 'Retrato em preto e branco do Mestre Carlos Gracie Jr., de kimono Gracie Barra' },
    requiresWrittenAuthorization: true,
  },
];
