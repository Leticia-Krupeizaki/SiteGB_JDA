import type { Metadata } from 'next';
import { ContactCTA } from '@/components/home/ContactCTA';
import { ProgramList } from '@/components/home/ProgramList';
import { PageHeader } from '@/components/layout/PageHeader';
import { ScheduleBoard } from '@/components/schedules/ScheduleBoard';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Horários',
  description:
    'Grade de aulas de Jiu-Jitsu da Gracie Barra Jardim das Américas, de segunda a sexta: infantil (GBK), adultos (GB1 e GB2), feminino (GBF) e No-Gi.',
  alternates: { canonical: '/horarios' },
};

export default function HorariosPage() {
  return (
    <>
      <PageHeader title="Horários" description="Aulas de segunda a sexta-feira. Grade vigente desde 26/02/2026." />

      <section className="bg-gb-line/60 py-12 sm:py-16">
        <Container>
          <ScheduleBoard />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="space-y-8">
          <SectionHeading title="Legenda das turmas" description="Competição e defesa pessoal indicam o foco do treino naquele horário, nas turmas GB1 + GB2." />
          <ProgramList />
        </Container>
      </section>

      <ContactCTA title="Escolheu o horário?" description="Chame no WhatsApp para agendar sua aula experimental." />
    </>
  );
}
