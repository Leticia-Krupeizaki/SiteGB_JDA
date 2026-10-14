import type { ExternalLink } from '@/data/external-links';
import { ExternalIcon } from './icons';

export function ExternalLinkItem({ link }: { link: ExternalLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring group flex items-center justify-between gap-4 border-b border-gb-line py-4 font-display text-2xl font-semibold uppercase text-gb-ink transition-colors hover:text-gb-red"
    >
      {link.name}
      <span className="sr-only">(abre em nova aba)</span>
      <ExternalIcon className="h-5 w-5 shrink-0 text-gb-mute transition-colors group-hover:text-gb-red" />
    </a>
  );
}
