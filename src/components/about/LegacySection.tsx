import { Container } from '@/components/ui/Container';
import { ExternalIcon } from '@/components/ui/icons';
import { legacy, legacySourceUrl, legacyWall } from '@/data/legacy';
import { getSiteImages } from '@/lib/content/site-images';
import { LegacyTimeline, type TimelineMaster } from './LegacyTimeline';

/**
 * "O legado Gracie Barra": história da rede e a linha do tempo dos 5 mestres.
 * Fundo preto, como uma parede de honra. Retratos pendentes: ver src/data/legacy.ts.
 */
export async function LegacySection() {
  const images = await getSiteImages();
  // Só o que o componente do navegador usa (fotos em src/data/site-images.ts, chave `legado-<id>`).
  const masters: TimelineMaster[] = legacyWall.map((master) => ({
    id: master.id,
    name: master.name,
    subtitle: master.subtitle,
    headline: master.headline,
    story: master.story,
    photo: images[`legado-${master.id}`],
  }));

  return (
    <section id="legado" aria-labelledby="legado-titulo" className="scroll-mt-24 bg-gb-ink py-16 text-gb-white sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <div>
            <h2 id="legado-titulo" className="font-display text-4xl font-bold uppercase sm:text-5xl">
              {legacy.title}
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-gb-line">
              {legacy.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </div>
          <dl className="space-y-5 self-end">
            {legacy.pillars.map((pillar) => (
              <div key={pillar.label} className="border-l-4 border-gb-red pl-4">
                <dt className="text-sm font-semibold uppercase tracking-wide text-gb-line">{pillar.label}</dt>
                <dd className="mt-1 font-display text-2xl font-bold uppercase">{pillar.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <h3 className="mt-16 font-display text-3xl font-bold uppercase">Linha do tempo do legado</h3>
        <p className="mt-2 text-gb-line">Cinco mestres, uma linhagem. Passe o mouse ou toque na foto para conhecer a história de cada um.</p>
        <LegacyTimeline masters={masters} mobile="vertical" />

        <a
          href={legacySourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring mt-12 inline-flex items-center gap-2 font-semibold text-gb-white underline underline-offset-4 hover:text-gb-line"
        >
          Conheça a história no site oficial da Gracie Barra
          <ExternalIcon className="h-4 w-4" />
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </Container>
    </section>
  );
}
