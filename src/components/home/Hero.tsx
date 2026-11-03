import { primaryCta } from '@/config/navigation';
import { site, whatsappTrialUrl } from '@/config/site';
import { Belt } from '@/components/ui/Belt';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PlaceholderBadge } from '@/components/ui/PlaceholderNotice';
import { PremiumSeal } from '@/components/ui/PremiumSeal';
import { SitePhoto } from '@/components/ui/SitePhoto';
import { getSiteImages } from '@/lib/content/site-images';

/**
 * Hero em tela cheia com foto de treino (enviada pelo painel) em P&B e
 * sobreposição escura. Sem foto, fundo gráfico identificado.
 */
export async function Hero() {
  const photo = (await getSiteImages())['home-hero'];

  return (
    <section className="relative isolate bg-gb-ink text-gb-white">
      {photo && <SitePhoto image={photo} fill priority sizes="100vw" className="-z-20 object-cover grayscale" />}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-gb-ink)_20%,transparent),color-mix(in_srgb,var(--color-gb-ink)_85%,transparent)),repeating-linear-gradient(135deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_10px)]"
      />
      <div className="mx-auto flex min-h-[34rem] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center sm:min-h-[40rem] sm:px-6 lg:px-8">
        <PremiumSeal priority sizes="(min-width: 640px) 144px, 112px" className="mb-6 w-28 sm:w-36" />
        <p className="font-display text-xl font-semibold uppercase tracking-[0.15em] text-balance text-gb-line">{site.name}</p>
        {/* Valores da Gracie Barra (Manual da Marca, p. 5). "Desenvolvimento" é longa: tamanhos medidos para caber a partir de 360 px. */}
        <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.9] sm:text-7xl lg:text-8xl">
          Irmandade. Integridade. Desenvolvimento.
        </h1>
        <p className="mt-8 font-display text-2xl font-bold uppercase tracking-wide text-balance sm:text-3xl">
          Transforme sua vida através do <span className="whitespace-nowrap">Jiu-Jitsu.</span>
        </p>
        <p className="mt-4 max-w-2xl text-xl text-gb-line">
          Na {site.name}, você encontra muito mais do que uma arte marcial: encontra uma família, um método de ensino e um
          caminho de evolução para todas as idades, a vida toda.
        </p>
        <ButtonLink href={whatsappTrialUrl} external className="mt-10 px-10 text-xl">
          {primaryCta.label}
        </ButtonLink>
      </div>
      {!photo && (
        <div className="absolute right-4 bottom-6 text-gb-line">
          <PlaceholderBadge label="Foto oficial a definir" />
        </div>
      )}
      <Belt />
    </section>
  );
}
