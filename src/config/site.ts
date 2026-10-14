/**
 * Dados centrais da unidade. Apenas informações confirmadas pelo cliente
 * (especificação v1.0, seção 1). Campos pendentes ficam `null` até confirmação.
 */
/** Domínio final ainda não definido; configure NEXT_PUBLIC_SITE_URL no deploy. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const site = {
  name: 'Gracie Barra Jardim das Américas',
  shortName: 'GB Jardim das Américas',
  city: 'Curitiba',
  state: 'PR',
  neighborhood: 'Jardim das Américas',
  /** Pendente: não inferir a partir do bairro. */
  address: null as string | null,
  /** Pendente: perfis oficiais ainda não fornecidos. */
  social: {} as Partial<Record<'instagram' | 'facebook' | 'youtube', string>>,
} as const;

export const contact = {
  displayPhone: '(41) 3205-8109',
  phoneE164: '+554132058109',
  whatsappDigits: '554132058109',
  trialMessage:
    'Olá! Gostaria de agendar uma aula experimental na Gracie Barra Jardim das Américas. Poderiam me passar mais informações?',
} as const;

export const phoneUrl = `tel:${contact.phoneE164}`;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${contact.whatsappDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const whatsappTrialUrl = whatsappUrl(contact.trialMessage);
