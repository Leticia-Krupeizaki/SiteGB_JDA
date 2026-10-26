/**
 * Dados centrais da unidade. Apenas informações confirmadas pelo cliente
 * (especificação v1.0, seção 1). Campos pendentes ficam `null` até confirmação.
 */
/** Domínio final ainda não definido; configure NEXT_PUBLIC_SITE_URL no deploy. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const site = {
  /** Certificada como escola Premium pela Gracie Barra em 2026 (confirmado pelo cliente em 19/10/2026). */
  name: 'Gracie Barra Premium Jardim das Américas',
  shortName: 'GB Premium Jardim das Américas',
  city: 'Curitiba',
  state: 'PR',
  neighborhood: 'Jardim das Américas',
  /** Endereço da unidade (enviado pelo cliente em 26/10/2026, igual ao perfil no Google). */
  address: {
    street: 'Rua Marechal Cardoso Júnior, 194',
    postalCode: '81530-420',
  },
  /** Perfis oficiais confirmados pelo cliente. Facebook e YouTube ainda não fornecidos. */
  social: {
    instagram: 'https://www.instagram.com/gbjardimdasamericas/',
  } as Partial<Record<'instagram' | 'facebook' | 'youtube', string>>,
} as const;

export const instagramHandle = '@gbjardimdasamericas';

export const contact = {
  /** Único número de contato, para ligação e WhatsApp (pedido do cliente em 19/10/2026). */
  displayPhone: '(41) 3205-8109',
  phoneE164: '+554132058109',
  whatsappDigits: '554132058109',
  /** E-mail oficial da unidade (enviado pelo cliente em 26/10/2026). */
  email: 'gbjardimdasamericas@outlook.com',
  trialMessage: `Olá! Gostaria de agendar uma aula experimental na ${site.name}. Poderiam me passar mais informações?`,
} as const;

export const phoneUrl = `tel:${contact.phoneE164}`;
export const emailUrl = `mailto:${contact.email}`;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${contact.whatsappDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const whatsappTrialUrl = whatsappUrl(contact.trialMessage);

/** Endereço completo em uma linha (contato, rodapé, llms.txt). */
export const fullAddress = `${site.address.street} – ${site.neighborhood}, ${site.city}–${site.state}, ${site.address.postalCode}`;

export const maps = {
  /** Perfil da escola no Google (link enviado pelo cliente): avaliações, fotos e rota. */
  profileUrl: 'https://share.google/BCkij0Hs97cPPHfa3',
  /** Abre a rota até a escola no Google Maps (app no celular). */
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${site.address.street}, ${site.city} - ${site.state}, ${site.address.postalCode}`)}`,
  /** Mapa incorporado sem chave de API. */
  embedUrl: `https://www.google.com/maps?q=${encodeURIComponent(`${site.address.street}, ${site.neighborhood}, ${site.city} - ${site.state}, ${site.address.postalCode}`)}&z=16&output=embed`,
};
