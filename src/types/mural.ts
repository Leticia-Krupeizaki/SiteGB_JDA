export type MuralCategory = 'TREINOS' | 'GRADUACOES' | 'CAMPEONATOS' | 'EVENTOS' | 'COMUNIDADE';

/** Foto publicada no mural. Nome e legenda só com autorização de quem aparece/enviou. */
export type MuralPost = {
  id: string;
  category: MuralCategory;
  studentName?: string;
  caption?: string;
  /** Caminho do arquivo em public/ (ex.: /fotos/mural/treino-sabado.webp). */
  imageUrl: string;
  /** Dimensões do arquivo, para reservar espaço e evitar que a página pule ao carregar. */
  width: number;
  height: number;
};
