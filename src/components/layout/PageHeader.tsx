import { Container } from '@/components/ui/Container';

export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <section className="bg-neutral-900 text-white">
      <Container className="py-14 sm:py-20">
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-neutral-300">{description}</p>}
      </Container>
    </section>
  );
}
