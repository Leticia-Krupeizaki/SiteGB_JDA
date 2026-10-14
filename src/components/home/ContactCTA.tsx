import { primaryCta } from '@/config/navigation';
import { contact, phoneUrl, whatsappTrialUrl } from '@/config/site';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';

export function ContactCTA({
  title = 'Venha conhecer o tatame',
  description = 'Chame no WhatsApp e a equipe ajuda você a escolher a turma para começar.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-gb-red text-gb-white">
      <Container className="flex flex-col gap-8 py-14 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-bold uppercase leading-none sm:text-5xl">{title}</h2>
          <p className="mt-4 text-lg">{description}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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
