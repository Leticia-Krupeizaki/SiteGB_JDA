type Props = {
  title: string;
  description?: string;
  as?: 'h1' | 'h2';
  tone?: 'light' | 'dark';
};

export function SectionHeading({ title, description, as: Tag = 'h2', tone = 'light' }: Props) {
  const dark = tone === 'dark';

  return (
    <div className="max-w-2xl">
      <Tag className={`font-display text-4xl font-bold uppercase leading-none sm:text-5xl ${dark ? 'text-gb-white' : 'text-gb-ink'}`}>
        {title}
      </Tag>
      {description && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-gb-line' : 'text-gb-mute'}`}>{description}</p>
      )}
    </div>
  );
}
