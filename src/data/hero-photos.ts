import type { StaticImageData } from 'next/image';
import turmaTatame from '@/assets/home/topo-1-turma-tatame.webp';
import femininoTatame from '@/assets/home/topo-2-feminino-tatame.webp';
import femininoGrupo from '@/assets/home/topo-3-feminino-grupo.webp';
import professores from '@/assets/home/topo-4-professores-faixas-pretas.webp';
import confraternizacao from '@/assets/home/topo-5-confraternizacao.webp';

/**
 * Carrossel de fotos no fundo do topo da página inicial (enviadas pelo cliente em 27/11/2026).
 * As fotos trocam sozinhas, na ordem abaixo, escurecidas atrás do texto.
 *
 * Para incluir uma foto: salve em src/assets/home/ (JPG ou WebP, horizontal de
 * preferência, até 2400 px), importe no topo e acrescente à lista. `position`
 * escolhe que parte da foto aparece quando ela é cortada (CSS object-position,
 * ex.: 'center 30%' mostra mais o alto da foto); o padrão é o centro.
 */
export type HeroPhoto = { src: StaticImageData; alt: string; position?: string };

export const heroPhotos: HeroPhoto[] = [
  { src: turmaTatame, alt: 'Turma da Gracie Barra Jardim das Américas reunida no tatame, de kimonos azuis e brancos' },
  { src: femininoTatame, alt: 'Encontro feminino: alunas de kimono sentadas no tatame da academia' },
  { src: femininoGrupo, alt: 'Alunas da academia de kimono, em frente ao retrato do Mestre Carlos Gracie Jr.' },
  { src: professores, alt: 'Professores e faixas pretas da unidade em frente à placa Gracie Barra Jardim das Américas', position: 'center 55%' },
  { src: confraternizacao, alt: 'Confraternização de alunos, professores e famílias da academia', position: 'center 58%' },
];
