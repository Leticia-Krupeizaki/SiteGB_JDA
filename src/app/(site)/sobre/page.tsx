import type { Metadata } from 'next';
import Image from 'next/image';
import { LegacySection } from '@/components/about/LegacySection';
import { ContactCTA } from '@/components/home/ContactCTA';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/ui/Container';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { PlaceholderNotice } from '@/components/ui/PlaceholderNotice';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/config/site';
import { benefits } from '@/data/benefits';
import { history } from '@/data/history';

export const metadata: Metadata = {
  title: 'A Academia',
  description: `Conheça a ${site.name}, unidade de Jiu-Jitsu em Curitiba–PR.`,
  alternates: { canonical: '/sobre' },
};

/** Trechos entre *asteriscos* no texto do cliente viram itálico (destaques do original). */
function Emphasis({ text }: { text: string }) {
  return text.split('*').map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part));
}

export default function SobrePage() {
  return (
    <>
      <PageHeader title="A academia" description={`${site.name}, Curitiba–PR.`} />

      <section aria-labelledby="nossa-historia" className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          {/* Foto: acima do texto no celular; ao lado (fixa durante a leitura) no computador. */}
          <figure className="lg:sticky lg:top-28 lg:self-start">
            {history.photo ? (
              <Image
                src={history.photo.src}
                alt={history.photo.alt}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[4/5] h-auto w-full object-cover"
              />
            ) : (
              <PhotoPlaceholder label="Foto do fundador com os filhos a definir" className="aspect-[4/5] w-full" />
            )}
            <figcaption className="mt-3 text-sm text-gb-mute">{history.photoCaption}</figcaption>
          </figure>

          <div>
            <h2 id="nossa-historia" className="font-display text-4xl font-bold uppercase sm:text-5xl">
              Nossa história
            </h2>
            <p className="mt-4 font-display text-2xl font-bold uppercase text-gb-red sm:text-3xl">{history.lead}</p>
            <div className="mt-8 space-y-5 text-lg leading-relaxed">
              {history.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>
                  <Emphasis text={paragraph} />
                </p>
              ))}
            </div>

            <blockquote className="my-10 border-y-2 border-gb-ink py-6 font-display text-2xl font-bold uppercase leading-snug text-balance sm:text-3xl">
              {history.quote}
            </blockquote>

            <div className="space-y-4 border-l-4 border-gb-red pl-5 text-lg leading-relaxed">
              {history.invitation.map((sentence) => (
                <p key={sentence.slice(0, 32)} className="last:text-xl">
                  <Emphasis text={sentence} />
                </p>
              ))}
            </div>

            <p className="mt-10 font-display text-xl font-bold uppercase text-gb-navy text-balance">{history.tagline}</p>
            <p className="mt-3 text-sm text-gb-mute">{history.signature}</p>
          </div>
        </Container>
      </section>

      <LegacySection />

      <section className="border-t border-gb-line py-16 sm:py-20">
        <Container className="space-y-6">
          <SectionHeading title="Estrutura" />
          <PlaceholderNotice>fotos e descrição do espaço, com material oficial.</PlaceholderNotice>
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
