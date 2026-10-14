import type { Metadata } from 'next';
import { ContactCTA } from '@/components/home/ContactCTA';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/ui/Container';
import { PlaceholderNotice } from '@/components/ui/PlaceholderNotice';

export const metadata: Metadata = {
  title: 'Professores',
  description: 'Equipe de professores da Gracie Barra Jardim das Américas.',
  alternates: { canonical: '/professores' },
};

export default function ProfessoresPage() {
  return (
    <>
      <PageHeader title="Professores" />
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <PlaceholderNotice>nomes, fotos, graduações e biografias da equipe, publicados somente após envio e aprovação do cliente.</PlaceholderNotice>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
