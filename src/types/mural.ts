/** Estados de moderação (especificação, seção 9.7). Toda transição é validada no backend. */
export type MuralStatus = 'PENDING' | 'AWAITING_GUARDIAN_AUTHORIZATION' | 'APPROVED' | 'REJECTED' | 'REMOVED';

export type MuralCategory = 'TREINOS' | 'GRADUACOES' | 'CAMPEONATOS' | 'EVENTOS' | 'COMUNIDADE';

export type ContactType = 'WHATSAPP' | 'EMAIL';

/** O que a galeria pública recebe: apenas dados publicáveis, nunca contato do remetente. */
export type PublicMuralPost = {
  id: string;
  category: MuralCategory;
  /** Só presentes quando houve consentimento para divulgar. */
  studentName?: string;
  caption?: string;
  imageUrl: string;
  /** Dimensões do derivado público, para reservar espaço e evitar CLS. */
  width: number;
  height: number;
};

export type PublicMuralPage = { items: PublicMuralPost[]; nextCursor: string | null };
