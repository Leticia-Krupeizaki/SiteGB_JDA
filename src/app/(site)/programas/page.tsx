import type { Metadata } from 'next';
import { ContactCTA } from '@/components/home/ContactCTA';
import { ProgramList } from '@/components/home/ProgramList';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CurriculumSection } from '@/components/programs/CurriculumSection';
import { site } from '@/config/site';
import { trainingFocuses } from '@/data/programs';
import { scheduleValidFrom } from '@/data/schedule';

const validFrom = scheduleValidFrom.split('-').reverse().join('/');

export const metadata: Metadata = {
  title: 'Programas',
  description: `Turmas de Jiu-Jitsu infantil, adulto, feminino e No-Gi na ${site.name}.`,
  alternates: { canonical: '/programas' },
};

export default function ProgramasPage() {
  return (
    <>
      <PageHeader title="Turmas e treinos" description={`Conforme a grade oficial da unidade, vigente desde ${validFrom}.`} />

      <section className="py-16 sm:py-20">
        <Container>
          <ProgramList />
        </Container>
      </section>

      <div className="border-t border-gb-line">
        <CurriculumSection />
      </div>

      <section className="bg-gb-line/60 py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading title="Focos de treino" description="Alguns horários das turmas GB1 + GB2 têm um foco específico, indicado na grade." />
          <div>
            <dl>
              {trainingFocuses.map((focus) => (
                <div key={focus.label} className="border-t border-gb-ink/20 py-4">
                  <dt className="font-display text-2xl font-bold uppercase text-gb-navy">{focus.label}</dt>
                  <dd className="mt-1 text-gb-mute first-letter:uppercase">{focus.description}</dd>
                </div>
              ))}
            </dl>
            <ButtonLink href="/horarios" variant="outline" className="mt-6">
              Ver a grade
            </ButtonLink>
          </div>
        </Container>
      </section>

      <ContactCTA title="Qual turma é a sua?" description="Tire suas dúvidas pelo WhatsApp e agende uma aula experimental." />
    </>
  );
}
