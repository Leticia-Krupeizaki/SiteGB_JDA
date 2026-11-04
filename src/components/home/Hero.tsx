import { primaryCta } from '@/config/navigation';
import { site, whatsappTrialUrl } from '@/config/site';
import { Belt } from '@/components/ui/Belt';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PremiumSeal } from '@/components/ui/PremiumSeal';
import { SitePhoto } from '@/components/ui/SitePhoto';
import { getSiteImages } from '@/lib/content/site-images';

/** Valores da Gracie Barra (Manual da Marca, p. 5), cada um numa faixa numerada. */
const values = [
  { word: 'Irmandade', size: '' },
  { word: 'Integridade', size: '' },
  // A mais longa sai menor para as três faixas caberem na mesma largura, a partir de 360 px.
  { word: 'Desenvolvimento', size: 'text-[0.8em]' },
];

/**
 * Hero em tela cheia. Com foto de treino (enviada pelo painel): P&B com sobreposição
 * escura. Sem foto: fundo gráfico preto com brilho vermelho à esquerda e azul GB no
 * canto, listras diagonais e vinheta. A logo da escola entra pela esquerda como
 * marca d'água em degradê; o conteúdo fica à direita dela (centralizado no celular).
 */
export async function Hero() {
  const images = await getSiteImages();
  const photo = images['home-hero'];
  const logo = images['marca-logo-escola'];

  return (
    <section className="relative isolate overflow-hidden bg-gb-ink text-gb-white">
      {photo ? (
        <>
          <SitePhoto image={photo} fill priority sizes="100vw" className="-z-20 object-cover grayscale" />
          <div
            aria-hidden
            className="absolute inset-0 -z-20 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-gb-ink)_20%,transparent),color-mix(in_srgb,var(--color-gb-ink)_85%,transparent))]"
          />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-[radial-gradient(60%_80%_at_18%_55%,rgb(225_37_27/0.28),transparent_70%),radial-gradient(45%_60%_at_92%_10%,rgb(17_40_109/0.35),transparent_70%),linear-gradient(to_bottom,#0b0b0b,#000)]"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.035)_0_1px,transparent_1px_12px),radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgb(0_0_0/0.75))]"
      />
      {logo && (
        <SitePhoto
          image={{ ...logo, alt: '' }}
          priority
          sizes="(min-width: 1024px) 700px, 420px"
          className="animate-hero-logo absolute [--hero-logo-opacity:0.22] lg:[--hero-logo-opacity:0.42] top-[calc(50%-13rem)] -left-56 -z-10 h-auto w-[26rem] [mask-image:linear-gradient(to_right,#000_45%,transparent_95%)] lg:top-[calc(50%-22rem)] lg:-left-44 lg:w-[44rem]"
        />
      )}
      <div className="mx-auto flex min-h-[34rem] max-w-6xl px-4 py-16 sm:min-h-[40rem] sm:px-6 lg:px-8">
        <div className="mx-auto my-auto flex w-full max-w-xl flex-col items-center gap-6 text-center lg:mr-0 lg:max-w-[37.5rem]">
          <p className="animate-rise flex items-center gap-3.5 font-display text-base font-semibold uppercase tracking-[0.2em] text-balance text-gb-line sm:text-lg">
            <span aria-hidden className="hidden h-0.5 w-10 shrink-0 bg-gb-red sm:block" />
            {site.name}
            <span aria-hidden className="hidden h-0.5 w-10 shrink-0 bg-gb-red sm:block" />
          </p>
          <h1 className="animate-rise w-full font-display text-[3.5rem] leading-none font-extrabold uppercase [animation-delay:0.2s] sm:text-[4rem] lg:text-[4.5rem]">
            {values.map(({ word, size }, i) => (
              <span key={word} className="flex items-center justify-between gap-4 border-t border-gb-white/20 py-2.5 last:border-b">
                <span aria-hidden className="font-display text-xl font-semibold text-gb-red">
                  0{i + 1}
                </span>
                <span className={size}>
                  {word}
                  <span className="sr-only">.</span>
                </span>
              </span>
            ))}
          </h1>
          <p className="animate-rise font-display text-2xl font-bold uppercase tracking-wide text-balance [animation-delay:0.35s] sm:text-3xl">
            Transforme sua vida através do <span className="whitespace-nowrap">Jiu-Jitsu.</span>
          </p>
          <ButtonLink href={whatsappTrialUrl} external className="animate-rise px-10 text-xl [animation-delay:0.45s]">
            {primaryCta.label}
          </ButtonLink>
          {/* Sem animação aqui: ela isolaria o selo e o preto dos cantos (mix-blend-lighten) voltaria a aparecer. */}
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <PremiumSeal sizes="(min-width: 640px) 112px, 96px" className="w-24 sm:w-28" />
            <span className="font-display text-base uppercase tracking-[0.15em] text-gb-line">Escola Premium · Certificação 2026</span>
          </div>
        </div>
      </div>
      <Belt />
    </section>
  );
}
