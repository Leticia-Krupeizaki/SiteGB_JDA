/** Estados de moderação (especificação, seção 9.7). Toda transição será validada no backend. */
export type MuralStatus = 'PENDING' | 'AWAITING_GUARDIAN_AUTHORIZATION' | 'APPROVED' | 'REJECTED' | 'REMOVED';

export type MuralCategory = 'TREINOS' | 'GRADUACOES' | 'CAMPEONATOS' | 'EVENTOS' | 'COMUNIDADE';

/** O que a galeria pública recebe: apenas dados publicáveis, nunca contato do remetente. */
export type PublicMuralPost = {
  id: string;
  category: MuralCategory;
  /** Só presentes quando houve consentimento para divulgar. */
  studentName?: string;
  caption?: string;
  /** Proporção largura/altura, para reservar espaço e evitar CLS. */
  aspectRatio: number;
  imageUrl?: string;
};
