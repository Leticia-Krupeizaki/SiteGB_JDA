type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Nível semântico do título; o visual é o mesmo. */
  as?: 'h1' | 'h2';
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
};

export function SectionHeading({ eyebrow, title, description, as: Tag = 'h2', align = 'left', tone = 'light' }: Props) {
  const centered = align === 'center' ? 'mx-auto text-center' : '';
  const dark = tone === 'dark';

  return (
    <div className={`max-w-2xl ${centered}`}>
      {eyebrow && (
        <p className={`mb-3 text-sm font-semibold uppercase tracking-[0.2em] ${dark ? 'text-red-300' : 'text-brand-red'}`}>
          {eyebrow}
        </p>
      )}
      <Tag className={`font-display text-3xl font-semibold uppercase leading-tight sm:text-4xl ${dark ? 'text-white' : 'text-neutral-900'}`}>
        {title}
      </Tag>
      {description && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? 'text-neutral-300' : 'text-neutral-600'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
