import { primaryCta } from '@/config/navigation';
import { whatsappTrialUrl } from '@/config/site';
import { Belt } from '@/components/ui/Belt';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { TodayOnMat } from './TodayOnMat';

/**
 * Sem foto até o cliente fornecer imagens licenciadas. Em vez de uma imagem
 * genérica, o hero mostra a informação mais útil: as aulas do dia.
 */
export function Hero() {
  return (
    <section className="bg-gb-navy text-gb-white">
      <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:py-24">
        <div>
          <p className="font-display text-xl font-semibold uppercase tracking-wide text-gb-line">
            Jiu-Jitsu no Jardim das Américas · Curitiba
          </p>
          <h1 className="mt-4 font-display text-6xl font-extrabold uppercase leading-[0.9] sm:text-8xl">
            Disciplina.
            <br />
            Respeito.
            <br />
            <span className="underline decoration-gb-red decoration-8 underline-offset-[0.12em] [text-decoration-skip-ink:none]">Evolução.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-gb-line">
            Turmas para crianças, adultos e mulheres, de segunda a sexta, de manhã, no almoço e à noite.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={whatsappTrialUrl} external>
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href="/horarios" variant="outline-light">
              Grade completa
            </ButtonLink>
          </div>
        </div>
        <TodayOnMat />
      </Container>
      <Belt />
    </section>
  );
}
