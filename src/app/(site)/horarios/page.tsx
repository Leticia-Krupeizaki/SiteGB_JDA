import type { Metadata } from 'next';
import { ContactCTA } from '@/components/home/ContactCTA';
import { ProgramList } from '@/components/home/ProgramList';
import { PageHeader } from '@/components/layout/PageHeader';
import { ScheduleBoard } from '@/components/schedules/ScheduleBoard';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { instagramHandle, site } from '@/config/site';
import { scheduleDisclaimer, scheduleValidFrom } from '@/data/schedule';
import { academyTimeZone, defaultDay } from '@/lib/schedule';

const validFrom = scheduleValidFrom.split('-').reverse().join('/');

/** A aba do dia sai com o dia do build e o navegador corrige para o dia de hoje ao abrir. */

export const metadata: Metadata = {
  title: 'Horários',
  description:
    `Grade de aulas de Jiu-Jitsu da ${site.name}, de segunda a sexta: infantil (GBK), adultos (GB1 e GB2), feminino (GBF) e No-Gi.`,
  alternates: { canonical: '/horarios' },
};

export default function HorariosPage() {
  return (
    <>
      <PageHeader title="Horários" description={`Aulas de segunda a sexta-feira. Grade vigente desde ${validFrom}.`} />

      <section className="bg-gb-line/60 py-12 sm:py-16">
        <Container>
          <ScheduleBoard initialDay={defaultDay(new Date(), academyTimeZone).day} />
          <p className="mt-8 text-sm text-gb-mute">
            {scheduleDisclaimer}{' '}
            {site.social.instagram && (
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="focus-ring font-semibold text-gb-navy underline">
                {instagramHandle}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            )}
            .
          </p>
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
