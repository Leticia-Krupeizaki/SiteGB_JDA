import { primaryCta } from '@/config/navigation';
import { contact, maps, phoneUrl, site, whatsappTrialUrl } from '@/config/site';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';

/** Bloco final de contato e localização. */
export function ContactCTA({
  title = 'Venha treinar com a gente',
  description = 'Chame no WhatsApp ou ligue para combinar sua aula experimental.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-gb-red text-gb-white">
      <Container className="grid gap-8 py-14 sm:py-16 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="space-y-4">
          <h2 className="font-display text-4xl font-bold uppercase leading-none sm:text-5xl">{title}</h2>
          <p className="text-lg">{description}</p>
          <p>
            <a href={maps.directionsUrl} target="_blank" rel="noopener noreferrer" className="focus-ring font-semibold underline underline-offset-4 hover:no-underline">
              {site.address.street} – {site.neighborhood}, {site.city}–{site.state}
              <span className="sr-only"> (rota no Google Maps, abre em nova aba)</span>
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <ButtonLink href={whatsappTrialUrl} external variant="light">
            {primaryCta.label}
          </ButtonLink>
          <ButtonLink href={phoneUrl} variant="outline-light">
            {contact.displayPhone}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
