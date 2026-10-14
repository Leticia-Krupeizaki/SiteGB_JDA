import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { PhoneIcon, WhatsAppIcon } from '@/components/ui/icons';
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
      <PageHeader eyebrow="Contato" title="Fale com a gente" description="Ligue ou chame no WhatsApp para tirar dúvidas e agendar sua aula experimental." />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 p-8">
            <WhatsAppIcon className="h-8 w-8 text-[#1f8f4e]" />
            <h2 className="mt-4 font-display text-2xl font-semibold uppercase">WhatsApp</h2>
            <p className="mt-2 text-neutral-600">{contact.displayPhone}</p>
            <p className="mt-2 text-sm text-neutral-600">
              Ao tocar no botão, o WhatsApp abre com uma mensagem pronta. O agendamento é combinado na conversa com a equipe.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <ButtonLink href={whatsappTrialUrl} external>
                {primaryCta.label}
              </ButtonLink>
              <ButtonLink href={whatsappUrl('Olá! Tenho uma dúvida sobre a Gracie Barra Jardim das Américas.')} external variant="secondary">
                Falar pelo WhatsApp
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 p-8">
            <PhoneIcon className="h-8 w-8 text-brand-red" />
            <h2 className="mt-4 font-display text-2xl font-semibold uppercase">Telefone</h2>
            <p className="mt-2 text-neutral-600">{contact.displayPhone}</p>
            <div className="mt-6">
              <ButtonLink href={phoneUrl} variant="secondary" className="w-full">
                Ligar para a academia
              </ButtonLink>
            </div>
          </div>
        </Container>

        <Container className="mt-10 space-y-4">
          <h2 className="font-display text-2xl font-semibold uppercase">Endereço e redes sociais</h2>
          <PlaceholderNotice>Endereço, mapa e perfis oficiais nas redes sociais serão exibidos após confirmação do cliente.</PlaceholderNotice>
        </Container>
      </section>
    </>
  );
}
