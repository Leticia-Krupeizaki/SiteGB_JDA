import type { StaticImageData } from 'next/image';
import gb1 from '@/assets/curriculos/gb1-curriculo.webp';
import gb2 from '@/assets/curriculos/gb2-curriculo.webp';
import gb2SemKimono from '@/assets/curriculos/gb2-sem-kimono-curriculo.webp';
import gb3 from '@/assets/curriculos/gb3-curriculo.webp';
import gbkJuniores from '@/assets/curriculos/gbk-juniores-adolescentes.webp';
import gbkMini from '@/assets/curriculos/gbk-mini-campeoes.webp';
import gbkPequenos1 from '@/assets/curriculos/gbk-pequenos-campeoes-1.webp';
import gbkPequenos2 from '@/assets/curriculos/gbk-pequenos-campeoes-2.webp';

/**
 * Currículos oficiais Gracie Barra enviados pelo cliente em 20/10/2026 (pôsteres de
 * uma página: 16 semanas, aulas A e B). PDFs em public/curriculos/, otimizados para
 * a web: só a textura de fundo foi reduzida e os dados privados do Illustrator
 * removidos; texto e tabelas (vetoriais) idênticos aos originais.
 * Informações abaixo tiradas dos próprios PDFs e da legenda oficial da grade.
 */
export type Curriculum = {
  slug: string;
  title: string;
  /** Público, quando o documento ou a grade oficial informa. */
  audience?: string;
  version: string;
  file: string;
  preview: StaticImageData;
};

export const curriculumGroups: { title: string; items: Curriculum[] }[] = [
  {
    title: 'Adultos',
    items: [
      { slug: 'gb1-curriculo', title: 'GB1', audience: 'Adultos, todos os níveis', version: '4.0', file: '/curriculos/gb1-curriculo.pdf', preview: gb1 },
      { slug: 'gb2-curriculo', title: 'GB2', audience: 'Adultos, faixa branca 3 graus e acima', version: '3.0', file: '/curriculos/gb2-curriculo.pdf', preview: gb2 },
      { slug: 'gb2-sem-kimono-curriculo', title: 'Sem Kimono', audience: 'Treino sem kimono (No-Gi)', version: '3.0', file: '/curriculos/gb2-sem-kimono-curriculo.pdf', preview: gb2SemKimono },
      { slug: 'gb3-curriculo', title: 'GB3', version: '3.0', file: '/curriculos/gb3-curriculo.pdf', preview: gb3 },
    ],
  },
  {
    title: 'GBK · Infantil',
    items: [
      { slug: 'gbk-mini-campeoes', title: 'Mini Campeões', version: '6.0', file: '/curriculos/gbk-mini-campeoes.pdf', preview: gbkMini },
      { slug: 'gbk-pequenos-campeoes-1', title: 'Pequenos Campeões 1', version: '6.0', file: '/curriculos/gbk-pequenos-campeoes-1.pdf', preview: gbkPequenos1 },
      { slug: 'gbk-pequenos-campeoes-2', title: 'Pequenos Campeões 2', version: '6.0', file: '/curriculos/gbk-pequenos-campeoes-2.pdf', preview: gbkPequenos2 },
      { slug: 'gbk-juniores-adolescentes', title: 'Juniores e Adolescentes', version: '6.0', file: '/curriculos/gbk-juniores-adolescentes.pdf', preview: gbkJuniores },
    ],
  },
];
