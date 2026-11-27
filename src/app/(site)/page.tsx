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
import { ExpandablePhoto } from '@/components/ui/ExpandablePhoto';
import { ExternalLinkCard } from '@/components/ui/ExternalLinkCard';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { SectionHeading } from '@/components/ui/SectionHeading';
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
      <section aria-labelledby="quem-somos" className="pb-16 sm:pb-24">
        {/*
         * Foto da turma em faixa larga. No computador o título fica por cima, sobre um
         * degradê escuro; no celular a foto aparece inteira e o título vem logo abaixo.
         * Clicar na foto amplia (ExpandablePhoto).
         */}
        <div className="relative lg:h-[36rem]">
          {unitPhoto ? (
            <ExpandablePhoto
              image={unitPhoto}
              sizes="100vw"
              className="w-full lg:absolute lg:inset-0 lg:h-full"
              imageClassName="h-auto w-full lg:h-full lg:object-cover lg:object-[center_40%]"
            />
          ) : (
            <PhotoPlaceholder label="Foto da unidade a definir" className="aspect-[16/7] w-full lg:absolute lg:inset-0 lg:aspect-auto lg:h-full" />
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_top,rgb(0_0_0/0.85),rgb(0_0_0/0.35)_45%,transparent_70%)] lg:block"
          />
          <Container className="pt-10 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:pt-0 lg:pb-14">
            <div className="max-w-3xl">
              <span aria-hidden className="mb-5 block h-1 w-16 bg-gb-red" />
              <h2 id="quem-somos" className="font-display text-4xl leading-none font-bold text-balance uppercase sm:text-5xl lg:text-6xl lg:text-gb-white">
                Somos {site.name}
              </h2>
              <p className="mt-4 font-display text-2xl font-bold text-balance text-gb-red uppercase sm:text-3xl lg:text-gb-white/90">
                {about.lead}
              </p>
            </div>
          </Container>
        </div>

        <Container className="mt-10 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="space-y-5 text-lg leading-relaxed lg:col-span-7">
            {about.paragraphs.map((paragraph, i) => (
              <p key={paragraph.slice(0, 32)} className={i === 0 ? 'text-xl font-medium text-gb-ink sm:text-2xl sm:leading-snug' : ''}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Fechamento em destaque, no mesmo estilo dos cards dos professores (preto com faixa vermelha). */}
          <aside className="relative bg-gb-ink p-8 text-gb-white lg:sticky lg:top-28 lg:col-span-5">
            <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-gb-red" />
            <ol className="space-y-4">
              {about.closing
                .split(/(?<=\.)\s+/)
                .map((sentence, i) => (
                  <li key={sentence} className="flex items-baseline gap-4 border-b border-gb-white/15 pb-4 last:border-0 last:pb-0">
                    <span aria-hidden className="font-display text-lg font-semibold text-gb-red">
                      0{i + 1}
                    </span>
                    <span className="font-display text-2xl leading-tight font-bold uppercase sm:text-3xl">{sentence}</span>
                  </li>
                ))}
            </ol>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <ButtonLink href={whatsappTrialUrl} external>
                {primaryCta.label}
              </ButtonLink>
              <ButtonLink href="/sobre" variant="outline-light">
                Conheça a academia
              </ButtonLink>
            </div>
          </aside>
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
