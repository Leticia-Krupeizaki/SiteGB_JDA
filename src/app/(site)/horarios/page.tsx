import type { Metadata } from 'next';
import { ContactCTA } from '@/components/home/ContactCTA';
import { ProgramList } from '@/components/home/ProgramList';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Horários',
  description: 'Grade de aulas de Jiu-Jitsu da Gracie Barra Jardim das Américas, de segunda a sexta.',
};

// A grade interativa com os 22 blocos e filtros entra na Etapa 2.
export default function HorariosPage() {
  return (
    <>
      <PageHeader title="Horários" description="De segunda a sexta-feira. Grade vigente desde 26/02/2026." />
      <section className="py-16 sm:py-20">
        <Container>
          <p className="border-l-4 border-gb-red pl-4 font-display text-2xl font-semibold uppercase">
            Grade interativa em construção
          </p>
          <div className="mt-14 space-y-8">
            <SectionHeading title="Legenda das turmas" />
            <ProgramList />
          </div>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
