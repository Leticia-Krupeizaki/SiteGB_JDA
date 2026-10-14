import Link from 'next/link';
import { ContactCTA } from '@/components/home/ContactCTA';
import { Hero } from '@/components/home/Hero';
import { ProgramList } from '@/components/home/ProgramList';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { ExternalLinkItem } from '@/components/ui/ExternalLinkCard';
import { ArrowRightIcon } from '@/components/ui/icons';
import { PlaceholderNotice } from '@/components/ui/PlaceholderNotice';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { contact, phoneUrl } from '@/config/site';
import { benefits } from '@/data/benefits';
import { externalLinks } from '@/data/external-links';
import { trainingFocuses } from '@/data/programs';

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <SectionHeading title="As turmas" description="Conforme a grade oficial da unidade, vigente desde 26/02/2026." />
            <ul className="space-y-3 text-gb-mute">
              {trainingFocuses.map((focus) => (
                <li key={focus.label}>
                  <strong className="text-gb-ink">{focus.label}:</strong> {focus.description}
                </li>
              ))}
            </ul>
            <ButtonLink href="/programas" variant="outline">
              Sobre as turmas
            </ButtonLink>
          </div>
          <ProgramList />
        </Container>
      </section>

      <section className="bg-gb-line/60 py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <SectionHeading title="A academia" description="A Gracie Barra Jardim das Américas é uma unidade da rede Gracie Barra em Curitiba." />
            <PlaceholderNotice>história, estrutura e fotos da unidade, que serão publicadas com o material enviado pelo cliente.</PlaceholderNotice>
            <Link href="/sobre" className="focus-ring inline-flex items-center gap-2 font-display text-xl font-semibold uppercase text-gb-navy hover:text-gb-red">
              Conheça a academia <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold uppercase">O que se treina além da técnica</h3>
            <dl className="mt-6 grid gap-x-10 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="border-t border-gb-ink/20 py-4">
                  <dt className="font-display text-2xl font-bold uppercase text-gb-navy">{benefit.title}</dt>
                  <dd className="mt-1 text-gb-mute">{benefit.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionHeading
              title="Mural da comunidade"
              description="Treinos, graduações, campeonatos e eventos registrados pelos próprios alunos. Cada foto é revisada pela equipe antes de aparecer."
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/mural">Enviar minha foto</ButtonLink>
              <ButtonLink href="/mural" variant="outline">
                Ver o mural
              </ButtonLink>
            </div>
          </div>
          <div className="space-y-6">
            <SectionHeading title="Professores" />
            <PlaceholderNotice>nomes, graduações e biografias da equipe, publicados somente após envio e aprovação.</PlaceholderNotice>
            <Link href="/professores" className="focus-ring inline-flex items-center gap-2 font-display text-xl font-semibold uppercase text-gb-navy hover:text-gb-red">
              Página da equipe <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-t border-gb-line py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading title="Links úteis" description="Plataformas de estudo da Gracie Barra, federações de Jiu-Jitsu e loja oficial." />
          <div className="grid gap-x-10 sm:grid-cols-2">
            {externalLinks.map((link) => (
              <ExternalLinkItem key={link.url} link={link} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-gb-line py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading title="Onde estamos" description="Jardim das Américas, Curitiba–PR." />
          <div className="space-y-4 self-end">
            <PlaceholderNotice>endereço completo e mapa.</PlaceholderNotice>
            <p className="text-gb-mute">
              Para chegar até nós, ligue para{' '}
              <a href={phoneUrl} className="focus-ring font-semibold text-gb-red">
                {contact.displayPhone}
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
