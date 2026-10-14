import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { PlaceholderNotice } from '@/components/ui/PlaceholderNotice';
import { primaryCta } from '@/config/navigation';
import { contact, phoneUrl, whatsappTrialUrl, whatsappUrl } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Fale com a Gracie Barra Jardim das Américas pelo telefone ou WhatsApp (41) 3205-8109.',
};

export default function ContatoPage() {
  return (
    <>
      <PageHeader title="Contato" description="Ligue ou chame no WhatsApp para tirar dúvidas e agendar sua aula experimental." />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-display text-lg font-semibold uppercase tracking-wide text-gb-mute">Telefone e WhatsApp</p>
            <a href={phoneUrl} className="focus-ring mt-2 block font-display text-5xl font-bold tabular-nums text-gb-navy hover:text-gb-red sm:text-7xl">
              {contact.displayPhone}
            </a>
            <p className="mt-4 max-w-md text-gb-mute">
              O botão abre o WhatsApp com uma mensagem pronta. O horário da aula é combinado na conversa com a equipe.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={whatsappTrialUrl} external>
                {primaryCta.label}
              </ButtonLink>
              <ButtonLink href={whatsappUrl('Olá! Tenho uma dúvida sobre a Gracie Barra Jardim das Américas.')} external variant="outline">
                Falar pelo WhatsApp
              </ButtonLink>
              <ButtonLink href={phoneUrl} variant="outline">
                Ligar
              </ButtonLink>
            </div>
          </div>

          <div className="space-y-4 border-t-2 border-gb-ink pt-6 lg:border-t-0 lg:border-l-2 lg:pt-0 lg:pl-10">
            <h2 className="font-display text-3xl font-bold uppercase">Endereço</h2>
            <p className="text-gb-mute">Jardim das Américas, Curitiba–PR</p>
            <PlaceholderNotice>endereço completo, mapa e redes sociais oficiais.</PlaceholderNotice>
          </div>
        </Container>
      </section>
    </>
  );
}
