import { primaryCta } from '@/config/navigation';
import { site, whatsappTrialUrl } from '@/config/site';
import { Belt } from '@/components/ui/Belt';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PlaceholderBadge } from '@/components/ui/PlaceholderNotice';

/**
 * Hero em tela cheia, pensado para receber uma foto oficial de treino em P&B
 * com sobreposição escura. Até lá, fundo gráfico identificado.
 */
export function Hero() {
  return (
    <section className="relative isolate bg-gb-ink text-gb-white">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(17,17,17,0.2),rgba(17,17,17,0.85)),repeating-linear-gradient(135deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_10px)]"
      />
      <div className="mx-auto flex min-h-[34rem] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center sm:min-h-[40rem] sm:px-6 lg:px-8">
        <p className="font-display text-xl font-semibold uppercase tracking-[0.15em] text-gb-line">{site.name}</p>
        <h1 className="mt-4 font-display text-6xl font-extrabold uppercase leading-[0.9] sm:text-8xl lg:text-9xl">
          Disciplina. Respeito. Evolução.
        </h1>
        <p className="mt-6 max-w-xl text-xl text-gb-line">Começar no Jiu-Jitsu é mais simples do que parece. Agende uma aula experimental e venha conhecer o tatame.</p>
        <ButtonLink href={whatsappTrialUrl} external className="mt-10 px-10 text-xl">
          {primaryCta.label}
        </ButtonLink>
      </div>
      <div className="absolute right-4 bottom-6 text-gb-line">
        <PlaceholderBadge label="Foto oficial a definir" />
      </div>
      <Belt />
    </section>
  );
}
