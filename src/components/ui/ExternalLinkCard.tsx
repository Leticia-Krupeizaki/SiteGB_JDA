import type { ExternalLink } from '@/data/external-links';
import { ExternalIcon } from './icons';

export function ExternalLinkCard({ link }: { link: ExternalLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring group flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-brand-red"
    >
      <span>
        <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">{link.category}</span>
        <span className="mt-1 block font-display text-xl font-medium uppercase text-neutral-900">{link.name}</span>
        <span className="sr-only">(abre em nova aba)</span>
      </span>
      <ExternalIcon className="h-5 w-5 shrink-0 text-neutral-600 transition-colors group-hover:text-brand-red" />
    </a>
  );
}
