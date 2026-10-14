import { PlaceholderBadge } from '@/components/ui/PlaceholderNotice';

/** Estado de conteúdo ausente: nomes e biografias só com dados enviados pelo cliente. */
export function TeacherPlaceholderCard() {
  return (
    <article className="rounded-lg border border-dashed border-neutral-300 bg-white p-6">
      <div aria-hidden className="flex aspect-[4/5] items-center justify-center rounded-md bg-neutral-100">
        <svg viewBox="0 0 24 24" className="h-16 w-16 text-neutral-300" fill="currentColor">
          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 5v1h16v-1c0-2.33-2.67-5-8-5z" />
        </svg>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <h3 className="font-display text-xl font-semibold uppercase text-neutral-600">Professor(a)</h3>
        <PlaceholderBadge label="A confirmar" />
      </div>
      <p className="mt-2 text-sm text-neutral-600">Nome, graduação e biografia serão publicados após envio e aprovação.</p>
    </article>
  );
}
