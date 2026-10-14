import { contact, phoneUrl, site, whatsappTrialUrl } from '@/config/site';
import { primaryCta } from '@/config/navigation';

/** Página provisória da Etapa 0. A Home completa chega na Etapa 1. */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="rounded bg-neutral-100 px-3 py-1 text-sm text-neutral-600">
        Site em construção — conteúdo provisório
      </p>
      <h1 className="font-display text-4xl uppercase tracking-wide sm:text-6xl">
        {site.name}
      </h1>
      <p className="text-neutral-600">
        {site.city}–{site.state} · <a className="underline" href={phoneUrl}>{contact.displayPhone}</a>
      </p>
      <a
        href={whatsappTrialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded bg-brand-red px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-red-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        {primaryCta.label}
      </a>
    </main>
  );
}
