import type { Metadata } from 'next';
import { ContactCTA } from '@/components/home/ContactCTA';
import { TeacherPlaceholderCard } from '@/components/home/TeacherCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/ui/Container';
import { PlaceholderNotice } from '@/components/ui/PlaceholderNotice';

export const metadata: Metadata = {
  title: 'Professores',
  description: 'Equipe de professores da Gracie Barra Jardim das Américas.',
};

export default function ProfessoresPage() {
  return (
    <>
      <PageHeader eyebrow="Equipe" title="Professores" />
      <section className="py-16 sm:py-20">
        <Container>
          <PlaceholderNotice>Nomes, fotos, graduações e biografias serão publicados somente após envio e aprovação do cliente.</PlaceholderNotice>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TeacherPlaceholderCard />
            <TeacherPlaceholderCard />
            <TeacherPlaceholderCard />
          </div>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
