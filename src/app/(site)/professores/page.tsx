import type { Metadata } from 'next';
import { ContactCTA } from '@/components/home/ContactCTA';
import { InstructorCards } from '@/components/instructors/InstructorCards';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/ui/Container';
import { site } from '@/config/site';
import { instructors } from '@/data/instructors';
import { getSiteImages } from '@/lib/content/site-images';

export const metadata: Metadata = {
  title: 'Professores',
  description: `Equipe de professores da ${site.name}.`,
  alternates: { canonical: '/professores' },
};

export default async function ProfessoresPage() {
  const images = await getSiteImages();
  // Só o que o componente do navegador usa (foto em src/data/site-images.ts, chave `professor-<id>`).
  const cards = instructors.map((instructor) => ({ ...instructor, photo: images[`professor-${instructor.id}`] ?? null }));

  return (
    <>
      <PageHeader title="Professores" description="Conheça a equipe que conduz os treinos da unidade." />
      <section className="py-16 sm:py-20 lg:pb-28">
        <Container>
          <p className="mb-10 text-gb-mute">Passe o mouse ou toque na foto para conhecer a trajetória de cada professor.</p>
          <InstructorCards instructors={cards} />
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
