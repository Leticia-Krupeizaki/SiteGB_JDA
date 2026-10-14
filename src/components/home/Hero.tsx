import { primaryCta } from '@/config/navigation';
import { site, whatsappTrialUrl } from '@/config/site';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { PlaceholderBadge } from '@/components/ui/PlaceholderNotice';

/**
 * Sem foto até o cliente fornecer imagens licenciadas: fundo gráfico escuro,
 * nunca uma foto genérica apresentada como se fosse da unidade.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-neutral-900 text-white">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(200,16,46,0.45),transparent_60%),repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0_2px,transparent_2px_14px)]"
      />
      <Container className="py-20 sm:py-28 lg:py-36">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-300">
          {site.name} · {site.city}
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold uppercase leading-[1.05] sm:text-6xl lg:text-7xl">
          Disciplina. Respeito. Evolução.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-300">
          Jiu-Jitsu para crianças e adultos no Jardim das Américas, com turmas de manhã, no almoço e à noite, de segunda a sexta.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={whatsappTrialUrl} external>
            {primaryCta.label}
          </ButtonLink>
          <ButtonLink href="/horarios" variant="inverted">
            Ver horários
          </ButtonLink>
        </div>
      </Container>
      <div className="absolute right-4 bottom-4">
        <PlaceholderBadge label="Foto oficial a definir" />
      </div>
    </section>
  );
}
