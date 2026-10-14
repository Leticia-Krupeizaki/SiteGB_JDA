import type { Metadata } from 'next';
import { BenefitCard } from '@/components/home/BenefitCard';
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
      <PageHeader eyebrow="A academia" title="Gracie Barra Jardim das Américas" description="Jiu-Jitsu em Curitiba–PR." />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title="Nossa história" />
            <div className="mt-6">
              <PlaceholderNotice>A história da unidade será publicada a partir das informações enviadas pelo cliente.</PlaceholderNotice>
            </div>
          </div>
          <div>
            <SectionHeading title="Estrutura" />
            <div className="mt-6">
              <PlaceholderNotice>Fotos e descrição do espaço físico serão adicionadas com material oficial.</PlaceholderNotice>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-neutral-100 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Valores" title="O que cultivamos no tatame" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {benefits.map((benefit, index) => (
              <BenefitCard key={benefit.title} index={index + 1} {...benefit} />
            ))}
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
