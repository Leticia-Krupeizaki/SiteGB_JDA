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
  /** Usado na chave da foto em src/data/site-images.ts (`legado-<id>`). */
  id: string;
  name: string;
  /** Sempre visível abaixo do nome, na linha do tempo. */
  subtitle: string;
  /** Título e história que surgem no card ampliado (hover ou toque); trechos entre **asteriscos duplos** saem em negrito. */
  headline: string;
  story: string[];
  /** Retrato oficial do Mural do Legado (ver aviso no topo do arquivo). */
  photo: null | { src: StaticImageData; alt: string };
  /** true: o manual exige autorização por escrito do franqueador para usar a imagem. */
  requiresWrittenAuthorization?: boolean;
};

/**
 * Linha do tempo do Legado, na ordem da linhagem. Histórias enviadas pelo cliente em
 * 09/11/2026, na íntegra; subtítulos e títulos tirados dos próprios textos.
 */
export const legacyWall: LegacyMaster[] = [
  {
    id: 'mitsuyo-maeda',
    name: 'Mitsuyo Maeda',
    subtitle: 'O início de um grande legado',
    headline: 'O início de um grande legado',
    story: [
      'A história do Jiu-Jitsu Brasileiro tem suas raízes nos ensinamentos de **Mitsuyo Maeda**, conhecido como **Conde Koma**, um mestre japonês que chegou ao Brasil em 1914 e transmitiu seus conhecimentos a **Carlos Gracie**, dando início a uma tradição que atravessaria gerações.',
      'Mais do que técnicas de defesa pessoal, Maeda compartilhava valores como **disciplina, respeito, coragem e superação**, princípios que ajudaram a construir a essência do Jiu-Jitsu Brasileiro.',
      'Na **Gracie Barra Premium Jardim das Américas**, honramos esse legado a cada treino, unindo tradição e evolução para transformar vidas por meio do esporte.',
      '**Mais do que ensinar Jiu-Jitsu, formamos pessoas mais confiantes, disciplinadas e preparadas para os desafios da vida.**',
    ],
    photo: { src: mitsuyoMaeda, alt: 'Retrato em preto e branco de Mitsuyo Maeda, de kimono' },
  },
  {
    id: 'carlos-gracie-sr',
    name: 'Carlos Gracie Sr.',
    subtitle: 'Uma filosofia de vida',
    headline: 'O Jiu-Jitsu como filosofia de vida',
    story: [
      'Carlos Gracie Sr. foi um dos grandes responsáveis pelo desenvolvimento e pela expansão do Jiu-Jitsu Brasileiro. Discípulo de Mitsuyo Maeda, transformou os ensinamentos recebidos em uma filosofia de vida baseada na disciplina, respeito, saúde e superação.',
      'Mais do que ensinar técnicas de defesa pessoal, Carlos acreditava que o Jiu-Jitsu deveria ser acessível a todos, promovendo o desenvolvimento físico, mental e pessoal.',
      'Seu legado inspirou seu filho, Carlos Gracie Jr., fundador da Gracie Barra, que levou essa filosofia para o mundo por meio do conceito “Jiu-Jitsu para Todos”.',
    ],
    photo: { src: carlosGracieSr, alt: 'Retrato em preto e branco do Mestre Carlos Gracie Sr.' },
    requiresWrittenAuthorization: true,
  },
  {
    id: 'helio-gracie',
    name: 'Hélio Gracie',
    subtitle: 'A técnica supera a força',
    headline: 'A força da superação',
    story: [
      'Hélio Gracie provou que a verdadeira força não está nos músculos, mas na determinação de superar os próprios limites. Mesmo enfrentando dificuldades físicas desde a infância, recusou-se a aceitar que suas limitações definissem seu destino.',
      'Com coragem, inteligência e perseverança, revolucionou o Jiu-Jitsu Brasileiro, mostrando ao mundo que a técnica pode superar a força e que nenhum desafio é maior do que a vontade de evoluir.',
      'Seu legado vai muito além dos tatames. É uma história de superação, disciplina, humildade e coragem, que continua inspirando gerações.',
    ],
    photo: { src: helioGracie, alt: 'Retrato em preto e branco de Hélio Gracie, de kimono' },
  },
  {
    id: 'rolls-gracie',
    name: 'Rolls Gracie',
    subtitle: 'A coragem de inovar',
    headline: 'Um verdadeiro visionário',
    story: [
      'Rolls Gracie foi um verdadeiro visionário que revolucionou o Jiu-Jitsu Brasileiro. Movido pela curiosidade, coragem e paixão pelo aprendizado, mostrou que respeitar a tradição também significa ter coragem para inovar.',
      'Ao explorar novas técnicas e integrar conhecimentos de outras artes marciais, Rolls transformou o Jiu-Jitsu em uma arte ainda mais dinâmica, completa e acessível, inspirando gerações a nunca se acomodarem e a buscarem constantemente a evolução.',
      'Seu espírito inovador influenciou profundamente Carlos Gracie Jr., fundador da Gracie Barra, e continua presente na filosofia de ensino da instituição.',
    ],
    photo: { src: rollsGracie, alt: 'Retrato em preto e branco de Rolls Gracie, de kimono' },
  },
  {
    id: 'carlos-gracie-jr',
    name: 'Carlos Gracie Jr.',
    subtitle: 'Fundador da Gracie Barra',
    headline: 'O visionário que transformou o Jiu-Jitsu em um legado mundial',
    story: [
      '**Carlos Gracie Jr.**, fundador da Gracie Barra, transformou a tradição de sua família em um movimento que ultrapassou fronteiras, conectando milhares de pessoas por meio do Jiu-Jitsu.',
      'Inspirado pelos ensinamentos de seu pai, Carlos Gracie Sr., e de seu mentor, Rolls Gracie, construiu uma filosofia baseada na **disciplina, respeito, união e evolução constante**, mostrando que o verdadeiro propósito do Jiu-Jitsu vai muito além das conquistas no tatame.',
      'Com a missão de levar o **“Jiu-Jitsu para Todos”**, criou uma metodologia de ensino que acolhe pessoas de todas as idades e níveis de experiência, transformando a Gracie Barra em uma comunidade presente em mais de 40 países.',
      'Na **Gracie Barra Premium Jardim das Américas**, temos orgulho de fazer parte dessa história, mantendo vivo seu propósito de **inspirar pessoas, transformar vidas e construir uma comunidade unida pelos valores da Irmandade, Integridade e Desenvolvimento**.',
      '**Porque o maior legado não está nas vitórias que conquistamos, mas nas vidas que transformamos ao longo do caminho.**',
    ],
    photo: { src: carlosGracieJr, alt: 'Retrato em preto e branco do Mestre Carlos Gracie Jr., de kimono Gracie Barra' },
    requiresWrittenAuthorization: true,
  },
];
