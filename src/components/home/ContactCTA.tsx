import { primaryCta } from '@/config/navigation';
import { contact, phoneUrl, whatsappTrialUrl } from '@/config/site';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { PlaceholderNotice } from '@/components/ui/PlaceholderNotice';

/** Bloco final de contato e localização. */
export function ContactCTA({
  title = 'Venha treinar com a gente',
  description = 'Jardim das Américas, Curitiba–PR. Chame no WhatsApp ou ligue para combinar sua aula experimental.',
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
          <PlaceholderNotice tone="dark">endereço completo e mapa.</PlaceholderNotice>
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
