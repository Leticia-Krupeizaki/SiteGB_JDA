/**
 * Plataformas externas solicitadas pelo cliente (especificação, seção 2).
 * Não apresentar como parceiros oficiais da unidade sem confirmação.
 */
export type ExternalLinkCategory = 'Educação' | 'Federações' | 'Produtos';

export type ExternalLink = {
  name: string;
  url: string;
  category: ExternalLinkCategory;
};

export const externalLinks: ExternalLink[] = [
  { category: 'Educação', name: 'Gracie Barra Online', url: 'https://online.graciebarra.com.br/' },
  { category: 'Educação', name: 'Gracie Barra Institute', url: 'https://institute.graciebarra.com.br/' },
  { category: 'Federações', name: 'FJJPR', url: 'https://fjjpr.com/' },
  { category: 'Federações', name: 'CBJJ', url: 'https://cbjj.com.br/' },
  { category: 'Federações', name: 'IBJJF', url: 'https://ibjjf.com/' },
  { category: 'Produtos', name: 'GB Wear', url: 'https://www.gbwear.com.br/' },
];
