import type { Metadata } from 'next';
import { ContactCTA } from '@/components/home/ContactCTA';
import { ProgramCard } from '@/components/home/ProgramCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { programs, trainingFocuses } from '@/data/programs';

export const metadata: Metadata = {
  title: 'Programas',
  description: 'Turmas de Jiu-Jitsu infantil, adulto, feminino e No-Gi na Gracie Barra Jardim das Américas.',
};

export default function ProgramasPage() {
  return (
    <>
      <PageHeader eyebrow="Programas" title="Turmas e treinos" description="Turmas conforme a grade oficial da unidade, vigente a partir de 26/02/2026." />

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading title="Turmas" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.code} program={program} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-neutral-100 py-16 sm:py-20">
        <Container>
          <SectionHeading
            title="Focos de treino"
            description="Alguns horários das turmas GB1 + GB2 têm um foco específico, indicado na grade."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {trainingFocuses.map((focus) => (
              <div key={focus.label} className="rounded-lg border border-neutral-200 bg-white p-6">
                <h3 className="font-display text-2xl font-semibold uppercase">{focus.label}</h3>
                <p className="mt-2 text-sm text-neutral-600">{focus.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <ButtonLink href="/horarios" variant="secondary">
              Ver horários das turmas
            </ButtonLink>
          </div>
        </Container>
      </section>

      <ContactCTA title="Qual turma é a sua?" description="Tire suas dúvidas pelo WhatsApp e agende uma aula experimental." />
    </>
  );
}
