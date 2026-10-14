import { Belt } from '@/components/ui/Belt';
import { Container } from '@/components/ui/Container';

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <section className="bg-gb-navy text-gb-white">
      <Container className="py-14 sm:py-20">
        <h1 className="font-display text-5xl font-bold uppercase leading-none sm:text-7xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-lg text-gb-line">{description}</p>}
      </Container>
      <Belt />
    </section>
  );
}
