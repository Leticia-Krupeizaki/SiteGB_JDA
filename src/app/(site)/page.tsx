import { ContactCTA } from '@/components/home/ContactCTA';
import { Hero } from '@/components/home/Hero';
import { ProgramList } from '@/components/home/ProgramList';
import { TodayOnMat } from '@/components/home/TodayOnMat';
import { ValuesBand } from '@/components/home/ValuesBand';
import { Belt } from '@/components/ui/Belt';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { ExternalLinkCard } from '@/components/ui/ExternalLinkCard';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { PlaceholderNotice } from '@/components/ui/PlaceholderNotice';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { primaryCta } from '@/config/navigation';
import { contact, phoneUrl, whatsappTrialUrl } from '@/config/site';
import { benefits } from '@/data/benefits';
import { externalLinks } from '@/data/external-links';

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Quem somos */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <PhotoPlaceholder label="Foto da unidade a definir" className="aspect-[4/3] w-full max-w-full" />
          <div className="space-y-6">
            <SectionHeading
              title="Somos Gracie Barra Jardim das Américas"
              description="Uma unidade da rede Gracie Barra em Curitiba, com aulas para crianças, adultos e uma turma exclusiva para mulheres, de segunda a sexta."
            />
            <PlaceholderNotice>história e diferenciais da unidade, com o material enviado pelo cliente.</PlaceholderNotice>
            <ButtonLink href="/sobre" variant="outline">
              Conheça a academia
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Belt />

      {/* O que é Jiu-Jitsu */}
      <section className="bg-gb-navy py-16 text-gb-white sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <SectionHeading
              tone="dark"
              title="O que é Jiu-Jitsu?"
              description="Uma arte marcial em que técnica e alavanca valem mais que tamanho e força. No treino, aprende-se a controlar o oponente no chão, com segurança e respeito ao parceiro."
            />
            <ButtonLink href={whatsappTrialUrl} external variant="light">
              Comece a treinar
            </ButtonLink>
          </div>
          <dl className="grid gap-x-10 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="border-t border-gb-white/25 py-5">
                <dt className="font-display text-2xl font-bold uppercase">{benefit.title}</dt>
                <dd className="mt-1 text-gb-line">{benefit.description}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <ValuesBand />

      {/* Turmas e horários */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-8">
            <SectionHeading title="Turmas" description="Conforme a grade oficial da unidade, vigente desde 26/02/2026." />
            <ProgramList />
          </div>
          <div className="space-y-6 lg:pt-28">
            <TodayOnMat />
            <ButtonLink href="/horarios" variant="outline" className="w-full">
              Ver a grade completa
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Chamada para aula experimental */}
      <section className="relative isolate overflow-hidden bg-gb-ink text-gb-white">
        <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.95] sm:text-6xl">Comece sua jornada no Jiu-Jitsu</h2>
            <p className="mt-5 max-w-xl text-lg text-gb-line">
              Fale com a equipe pelo WhatsApp, tire suas dúvidas e combine o melhor dia para a sua aula experimental.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <ButtonLink href={whatsappTrialUrl} external>
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href={phoneUrl} variant="outline-light">
              Ligar: {contact.displayPhone}
            </ButtonLink>
          </div>
        </Container>
        <Belt />
      </section>

      {/* Mural */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="space-y-6 lg:order-2">
            <SectionHeading
              title="Nosso tatame, nossa história"
              description="Treinos, graduações, campeonatos e eventos registrados pelos próprios alunos no Mural da Comunidade. Cada foto é revisada pela equipe antes de aparecer."
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/mural">Enviar minha foto</ButtonLink>
              <ButtonLink href="/mural" variant="outline">
                Ver o mural
              </ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:order-1">
            <PhotoPlaceholder label="Foto do mural" className="aspect-square" />
            <PhotoPlaceholder label="Foto do mural" className="aspect-square translate-y-8" />
          </div>
        </Container>
      </section>

      {/* Ecossistema */}
      <section className="bg-gb-line/60 py-16 sm:py-24">
        <Container>
          <SectionHeading title="Ecossistema Gracie Barra" description="Plataformas de estudo, federações de Jiu-Jitsu e a loja oficial." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {externalLinks.map((link) => (
              <ExternalLinkCard key={link.url} link={link} />
            ))}
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
