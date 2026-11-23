import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { MuralGallery } from '@/components/mural/MuralGallery';
import { Container } from '@/components/ui/Container';
import { site } from '@/config/site';
import { muralPosts } from '@/data/mural';

export const metadata: Metadata = {
  title: 'Mural',
  description: `Mural da comunidade da ${site.name}: fotos de treinos, graduações, campeonatos e eventos.`,
  alternates: { canonical: '/mural' },
};

export default function MuralPage() {
  return (
    <>
      <PageHeader title="Nosso tatame, nossa história" description="Treinos, graduações, campeonatos e eventos da nossa comunidade." />

      <section className="bg-gb-line/60 py-12 sm:py-16">
        <Container>
          <MuralGallery posts={muralPosts} />
        </Container>
      </section>
    </>
  );
}
