import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { ExternalIcon } from '@/components/ui/icons';
import { legacy, legacySourceUrl, legacyWall } from '@/data/legacy';

/**
 * "O legado Gracie Barra": história da rede e o Mural do Legado (5 mestres).
 * Fundo preto, como uma parede de honra. Retratos pendentes: ver src/data/legacy.ts.
 */
export function LegacySection() {
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

        <h3 className="mt-16 font-display text-3xl font-bold uppercase">Mural do Legado</h3>
        <p className="mt-2 text-gb-line">Os mestres que construíram o caminho que seguimos no tatame.</p>
        <ol className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {legacyWall.map((master) => (
            <li key={master.name}>
              <figure>
                {master.photo ? (
                  <Image src={master.photo.src} alt={master.photo.alt} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" className="aspect-[3/4] h-auto w-full object-cover grayscale" />
                ) : (
                  <div role="img" aria-label={`Retrato de ${master.name} a definir`} className="flex aspect-[3/4] w-full items-end border border-gb-white/20 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_10px)] p-3">
                    <span className="border border-dashed border-gb-line/50 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gb-line">Retrato oficial a definir</span>
                  </div>
                )}
                <figcaption className="mt-3">
                  <span className="block font-display text-xl font-bold uppercase leading-tight">{master.name}</span>
                  <span className="mt-1 block text-sm leading-snug text-gb-line">{master.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

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
