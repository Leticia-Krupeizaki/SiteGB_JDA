import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { PlaceholderNotice } from '@/components/ui/PlaceholderNotice';
import { primaryCta } from '@/config/navigation';
import { InstagramIcon } from '@/components/ui/icons';
import { contact, instagramHandle, phoneUrl, site, whatsappTrialUrl, whatsappUrl } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contato',
  description: `Fale com a ${site.name}: telefone ${contact.displayPhone} ou WhatsApp ${contact.whatsappDisplay}.`,
  alternates: { canonical: '/contato' },
};

export default function ContatoPage() {
  return (
    <>
      <PageHeader title="Contato" description="Ligue ou chame no WhatsApp para tirar dúvidas e agendar sua aula experimental." />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-display text-lg font-semibold uppercase tracking-wide text-gb-mute">WhatsApp</p>
            <a
              href={whatsappTrialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-2 block font-display text-5xl font-bold tabular-nums text-gb-navy hover:text-gb-red sm:text-7xl"
            >
              {contact.whatsappDisplay}
              <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
            </a>
            <p className="mt-4 font-display text-lg font-semibold uppercase tracking-wide text-gb-mute">
              Telefone fixo:{' '}
              <a href={phoneUrl} className="focus-ring tabular-nums text-gb-navy hover:text-gb-red">
                {contact.displayPhone}
              </a>
            </p>
            <p className="mt-4 max-w-md text-gb-mute">
              O botão abre o WhatsApp com uma mensagem pronta. O horário da aula é combinado na conversa com a equipe.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={whatsappTrialUrl} external>
                {primaryCta.label}
              </ButtonLink>
              <ButtonLink href={whatsappUrl(`Olá! Tenho uma dúvida sobre a ${site.name}.`)} external variant="outline">
                Falar pelo WhatsApp
              </ButtonLink>
              <ButtonLink href={phoneUrl} variant="outline">
                Ligar
              </ButtonLink>
            </div>
          </div>

          <div className="space-y-8 border-t-2 border-gb-ink pt-6 lg:border-t-0 lg:border-l-2 lg:pt-0 lg:pl-10">
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-bold uppercase">Endereço</h2>
              <p className="text-gb-mute">Jardim das Américas, Curitiba–PR</p>
              <PlaceholderNotice>endereço completo e mapa.</PlaceholderNotice>
            </div>
            {site.social.instagram && (
              <div className="space-y-3">
                <h2 className="font-display text-3xl font-bold uppercase">Instagram</h2>
                <p className="text-gb-mute">Treinos, graduações e novidades da equipe.</p>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-2 font-display text-2xl font-semibold text-gb-navy hover:text-gb-red"
                >
                  <InstagramIcon className="h-6 w-6" />
                  {instagramHandle}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
