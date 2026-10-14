export type NavItem = {
  label: string;
  href: string;
};

export const mainNavigation: NavItem[] = [
  { label: 'Início', href: '/' },
  { label: 'A Academia', href: '/sobre' },
  { label: 'Programas', href: '/programas' },
  { label: 'Professores', href: '/professores' },
  { label: 'Horários', href: '/horarios' },
  { label: 'Mural', href: '/mural' },
  { label: 'Contato', href: '/contato' },
];

export const primaryCta = {
  label: 'Agende sua aula experimental',
} as const;
