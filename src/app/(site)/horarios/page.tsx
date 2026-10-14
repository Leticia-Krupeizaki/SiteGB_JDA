import type { Metadata } from 'next';
import { ContactCTA } from '@/components/home/ContactCTA';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/ui/Container';
import { programs } from '@/data/programs';

export const metadata: Metadata = {
  title: 'Horários',
  description: 'Grade de aulas de Jiu-Jitsu da Gracie Barra Jardim das Américas, de segunda a sexta.',
};

// A grade interativa com os 22 blocos e filtros entra na Etapa 2.
export default function HorariosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Horários"
        title="Horários de treinamento"
        description="Grade de segunda a sexta-feira, vigente a partir de 26/02/2026."
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-100 p-8 text-center">
            <p className="font-display text-2xl uppercase">Grade interativa em construção</p>
            <p className="mt-2 text-neutral-600">Enquanto isso, confirme os horários pelo WhatsApp.</p>
          </div>

          <h2 className="mt-14 font-display text-2xl font-semibold uppercase">Legenda das turmas</h2>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <div key={program.code} className="rounded-md border border-neutral-200 p-4">
                <dt className="font-display text-xl font-bold uppercase text-brand-red">{program.label}</dt>
                <dd className="mt-1 text-sm text-neutral-600">{program.audience}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
