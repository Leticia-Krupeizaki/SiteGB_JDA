import type { ExternalLink } from '@/data/external-links';
import { ExternalIcon } from './icons';

export function ExternalLinkCard({ link }: { link: ExternalLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring group flex min-h-36 flex-col justify-between border-b-4 border-gb-navy bg-gb-white p-6 transition-colors hover:border-gb-red"
    >
      <span className="flex items-start justify-between gap-4">
        <span className="text-sm font-semibold uppercase tracking-wide text-gb-mute">{link.category}</span>
        <ExternalIcon className="h-5 w-5 shrink-0 text-gb-mute transition-colors group-hover:text-gb-red" />
      </span>
      <span className="font-display text-3xl font-bold uppercase text-gb-ink">{link.name}</span>
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  );
}
