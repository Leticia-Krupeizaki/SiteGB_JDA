import { primaryCta } from '@/config/navigation';
import { contact, phoneUrl, whatsappTrialUrl } from '@/config/site';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';

export function ContactCTA({
  title = 'Venha treinar com a gente',
  description = 'Chame no WhatsApp para combinar sua aula experimental. A equipe responde com os detalhes da turma ideal para você.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-brand-red text-white">
      <Container className="flex flex-col items-start gap-8 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold uppercase sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-red-50">{description}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
          <ButtonLink href={whatsappTrialUrl} external variant="light">
            {primaryCta.label}
          </ButtonLink>
          <ButtonLink href={phoneUrl} variant="inverted">
            Ligar: {contact.displayPhone}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
