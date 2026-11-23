import { Container } from '@/components/ui/Container';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { SitePhoto } from '@/components/ui/SitePhoto';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { method, methodPrograms } from '@/data/method';
import { getSiteImages } from '@/lib/content/site-images';

/**
 * Apresentação do Método Gracie Barra (página Programas): introdução, os quatro
 * programas em cards e o fechamento "Muito além do tatame", com foto em src/data/site-images.ts.
 */
export async function MethodSection() {
  const photo = (await getSiteImages())['programas-alem-do-tatame'];

  return (
    <>
      <section aria-labelledby="metodo" className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <p className="font-display text-lg font-semibold uppercase tracking-[0.2em] text-gb-red">{method.tagline}</p>
            <h2 id="metodo" className="mt-3 font-display text-5xl font-bold uppercase leading-none sm:text-6xl">
              {method.title}
            </h2>
            <p className="mt-6 border-l-4 border-gb-red pl-5 font-display text-2xl font-semibold uppercase leading-tight text-gb-navy sm:text-3xl">
              {method.lead}
            </p>
          </div>
          <div>
            {method.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-lg leading-relaxed text-gb-mute first:mt-0">
                {paragraph}
              </p>
            ))}
            <ul aria-label="Valores incentivados" className="mt-8 flex flex-wrap gap-2">
              {method.values.map((value) => (
                <li key={value} className="border-2 border-gb-ink px-3 py-1 font-display text-base font-semibold uppercase tracking-wide">
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section aria-labelledby="jornada" className="bg-gb-ink py-16 text-gb-white sm:py-20">
        <Container>
          <div id="jornada">
            <SectionHeading title={method.journey.title} description={method.journey.description} tone="dark" />
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {methodPrograms.map((program, i) => (
              <li key={program.code} className="flex flex-col bg-gb-white p-6 text-gb-ink">
                <span aria-hidden className={`flex h-2.5 w-20 ${program.color}`}>
                  {program.redTip && <span className="mr-3 ml-auto w-5 bg-gb-red" />}
                </span>
                <div className="mt-5 flex flex-1 flex-col">
                  <p className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-gb-mute">
                    Etapa {i + 1} de {methodPrograms.length}
                  </p>
                  <h3 className="mt-2 font-display leading-none font-bold uppercase">
                    <span className="block text-6xl text-gb-navy">{program.code}</span>
                    <span className="mt-2 block text-2xl">{program.name}</span>
                  </h3>
                  <p className="mt-4 leading-relaxed text-gb-mute">{program.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="alem-do-tatame" className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <h2 id="alem-do-tatame" className="font-display text-5xl font-bold uppercase leading-none sm:text-6xl">
              {method.beyond.title}
            </h2>
            {/* Ampliação leve ao passar o mouse (sem animação para quem pede menos movimento, ver globals.css). */}
            {photo ? (
              <div className="group mt-8 overflow-hidden">
                <SitePhoto
                  image={photo}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="aspect-[4/3] h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            ) : (
              <PhotoPlaceholder label="Foto a definir" className="mt-8 aspect-[4/3] w-full" />
            )}
          </div>
          <div>
            {method.beyond.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-lg leading-relaxed text-gb-mute first:mt-0">
                {paragraph}
              </p>
            ))}
            <p className="mt-8 font-display text-2xl font-bold uppercase text-gb-red sm:text-3xl">{method.beyond.signature}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
