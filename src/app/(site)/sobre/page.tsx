import type { Metadata } from 'next';
import { ContactCTA } from '@/components/home/ContactCTA';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/ui/Container';
import { PlaceholderNotice } from '@/components/ui/PlaceholderNotice';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { benefits } from '@/data/benefits';

export const metadata: Metadata = {
  title: 'A Academia',
  description: 'Conheça a Gracie Barra Jardim das Américas, unidade de Jiu-Jitsu em Curitiba–PR.',
};

export default function SobrePage() {
  return (
    <>
      <PageHeader title="A academia" description="Gracie Barra Jardim das Américas, Curitiba–PR." />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionHeading title="Nossa história" />
            <PlaceholderNotice>a história da unidade, a partir das informações enviadas pelo cliente.</PlaceholderNotice>
          </div>
          <div className="space-y-6">
            <SectionHeading title="Estrutura" />
            <PlaceholderNotice>fotos e descrição do espaço, com material oficial.</PlaceholderNotice>
          </div>
        </Container>
      </section>

      <section className="bg-gb-line/60 py-16 sm:py-20">
        <Container>
          <SectionHeading title="O que se treina além da técnica" />
          <dl className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="border-t border-gb-ink/20 py-4">
                <dt className="font-display text-2xl font-bold uppercase text-gb-navy">{benefit.title}</dt>
                <dd className="mt-1 text-gb-mute">{benefit.description}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
