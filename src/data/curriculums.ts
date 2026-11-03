import type { StaticImageData } from 'next/image';
import gb1 from '@/assets/curriculos/gb1-curriculo.webp';
import gb1Full from '@/assets/curriculos/gb1-curriculo-completo.webp';
import gb2 from '@/assets/curriculos/gb2-curriculo.webp';
import gb2Full from '@/assets/curriculos/gb2-curriculo-completo.webp';
import gb2SemKimono from '@/assets/curriculos/gb2-sem-kimono-curriculo.webp';
import gb2SemKimonoFull from '@/assets/curriculos/gb2-sem-kimono-curriculo-completo.webp';
import gb3 from '@/assets/curriculos/gb3-curriculo.webp';
import gb3Full from '@/assets/curriculos/gb3-curriculo-completo.webp';
import gbkJuniores from '@/assets/curriculos/gbk-juniores-adolescentes.webp';
import gbkJunioresFull from '@/assets/curriculos/gbk-juniores-adolescentes-completo.webp';
import gbkMini from '@/assets/curriculos/gbk-mini-campeoes.webp';
import gbkMiniFull from '@/assets/curriculos/gbk-mini-campeoes-completo.webp';
import gbkPequenos1 from '@/assets/curriculos/gbk-pequenos-campeoes-1.webp';
import gbkPequenos1Full from '@/assets/curriculos/gbk-pequenos-campeoes-1-completo.webp';
import gbkPequenos2 from '@/assets/curriculos/gbk-pequenos-campeoes-2.webp';
import gbkPequenos2Full from '@/assets/curriculos/gbk-pequenos-campeoes-2-completo.webp';

/**
 * Currículos oficiais Gracie Barra enviados pelo cliente em 20/10/2026 (pôsteres de
 * uma página: 16 semanas, aulas A e B). Só visualização, sem download (pedido do
 * cliente, 26/10/2026): o site mostra uma imagem do pôster (1800 px de largura,
 * gerada do PDF) e não publica o PDF. Os PDFs otimizados ficam em assets/curriculos/,
 * fora da pasta pública, como fonte para gerar as imagens.
 * Informações abaixo tiradas dos próprios PDFs e da legenda oficial da grade.
 *
 * São os pôsteres PADRÃO: o administrador envia as versões novas pelo painel
 * (/admin/curriculos) e elas valem no lugar destes (src/lib/content/curriculums.ts).
 */
export type Curriculum = {
  slug: string;
  title: string;
  /** Público, quando o documento ou a grade oficial informa. */
  audience?: string;
  version: string;
  /** Miniatura do card (480 px). */
  preview: StaticImageData;
  /** Pôster inteiro, legível, para o visualizador. */
  full: StaticImageData;
  /** Preenchidos quando o pôster foi enviado pelo painel. */
  custom?: boolean;
  /** Mês de referência, AAAA-MM. */
  referenceMonth?: string;
};

export const curriculumGroups: { title: string; items: Curriculum[] }[] = [
  {
    title: 'Adultos',
    items: [
      { slug: 'gb1-curriculo', title: 'GB1', audience: 'Adultos, todos os níveis', version: '4.0', preview: gb1, full: gb1Full },
      { slug: 'gb2-curriculo', title: 'GB2', audience: 'Adultos, faixa branca 3 graus e acima', version: '3.0', preview: gb2, full: gb2Full },
      { slug: 'gb2-sem-kimono-curriculo', title: 'Sem Kimono', audience: 'Treino sem kimono (No-Gi)', version: '3.0', preview: gb2SemKimono, full: gb2SemKimonoFull },
      { slug: 'gb3-curriculo', title: 'GB3', version: '3.0', preview: gb3, full: gb3Full },
    ],
  },
  {
    title: 'GBK · Infantil',
    items: [
      { slug: 'gbk-mini-campeoes', title: 'Mini Campeões', version: '6.0', preview: gbkMini, full: gbkMiniFull },
      { slug: 'gbk-pequenos-campeoes-1', title: 'Pequenos Campeões 1', version: '6.0', preview: gbkPequenos1, full: gbkPequenos1Full },
      { slug: 'gbk-pequenos-campeoes-2', title: 'Pequenos Campeões 2', version: '6.0', preview: gbkPequenos2, full: gbkPequenos2Full },
      { slug: 'gbk-juniores-adolescentes', title: 'Juniores e Adolescentes', version: '6.0', preview: gbkJuniores, full: gbkJunioresFull },
    ],
  },
];
