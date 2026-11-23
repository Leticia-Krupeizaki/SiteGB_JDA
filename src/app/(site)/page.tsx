import { LegacyIntro } from '@/components/about/LegacyIntro';
import { ContactCTA } from '@/components/home/ContactCTA';
import { Hero } from '@/components/home/Hero';
import { MuralPreview } from '@/components/home/MuralPreview';
import { ProgramList } from '@/components/home/ProgramList';
import { TodayOnMat } from '@/components/home/TodayOnMat';
import { ValuesBand } from '@/components/home/ValuesBand';
import { Belt } from '@/components/ui/Belt';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { ExternalLinkCard } from '@/components/ui/ExternalLinkCard';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SitePhoto } from '@/components/ui/SitePhoto';
import { primaryCta } from '@/config/navigation';
import { contact, phoneUrl, site, whatsappTrialUrl } from '@/config/site';
import { about } from '@/data/about';
import { benefits } from '@/data/benefits';
import { externalLinks } from '@/data/external-links';
import { legacyWall } from '@/data/legacy';
import { getSiteImages } from '@/lib/content/site-images';
import { academyTimeZone, defaultDay } from '@/lib/schedule';

/** O "Hoje no tatame" sai com o dia do build e o navegador corrige para o dia de hoje ao abrir. */
export default async function HomePage() {
  const today = defaultDay(new Date(), academyTimeZone);
  const images = await getSiteImages();
  const unitPhoto = images['home-unidade'];
  // Abertura do legado: só o que a tela usa (fotos em src/data/site-images.ts, chave `legado-<id>`).
  const introMasters = legacyWall.map(({ id, name, subtitle, headline }) => ({ id, name, subtitle, headline, photo: images[`legado-${id}`] }));

  return (
    <>
      <LegacyIntro masters={introMasters} ctaHref={whatsappTrialUrl} ctaLabel={primaryCta.label} />
      <Hero />

      {/* Quem somos */}
      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          {/* Foto acompanha a leitura no computador (o texto é mais alto que ela). */}
          {unitPhoto ? (
            <SitePhoto image={unitPhoto} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] h-auto w-full max-w-full object-cover lg:sticky lg:top-28" />
          ) : (
            <PhotoPlaceholder label="Foto da unidade a definir" className="aspect-[4/3] w-full max-w-full lg:sticky lg:top-28" />
          )}
          <div className="space-y-6">
            <SectionHeading title={`Somos ${site.name}`} />
            <p className="font-display text-2xl font-bold uppercase text-balance text-gb-red sm:text-3xl">{about.lead}</p>
            <div className="space-y-4 text-lg leading-relaxed">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <p className="border-l-4 border-gb-red pl-4 font-display text-2xl font-bold uppercase leading-snug text-balance">{about.closing}</p>
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
            <TodayOnMat initial={today} />
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
              description="Treinos, graduações, campeonatos e eventos da nossa comunidade, reunidos no Mural."
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/mural">Ver o mural</ButtonLink>
            </div>
          </div>
          <MuralPreview />
        </Container>
      </section>

      {/* Ecossistema */}
      <section className="bg-gb-line/60 py-16 sm:py-24">
        <Container>
          <SectionHeading title="Ecossistema Gracie Barra" description="Plataformas de estudo, a busca de escolas da rede, federações de Jiu-Jitsu e a loja oficial." />
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
