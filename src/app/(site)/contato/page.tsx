import type { Metadata } from 'next';
import type { ComponentType, ReactNode, SVGProps } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { primaryCta } from '@/config/navigation';
import { InstagramIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/icons';
import { contact, emailUrl, fullAddress, instagramHandle, maps, phoneUrl, site, whatsappTrialUrl, whatsappUrl } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contato',
  description: `${fullAddress}. Fale com a ${site.name} pelo telefone ou WhatsApp ${contact.displayPhone} ou pelo e-mail ${contact.email}.`,
  alternates: { canonical: '/contato' },
};

const [emailUser, emailDomain] = contact.email.split('@');

/** Mesma escala em todos os cards: rótulo pequeno, valor em destaque, texto de apoio e ações no rodapé do card. */
function ContactCard({
  icon: Icon,
  label,
  value,
  children,
  actions,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: ReactNode;
  children: ReactNode;
  actions: ReactNode;
}) {
  return (
    <div className="flex flex-col border-t-4 border-gb-red bg-gb-white p-6 shadow-sm sm:p-8">
      <span className="inline-flex h-12 w-12 items-center justify-center bg-gb-navy text-gb-white">
        <Icon className="h-6 w-6" />
      </span>
      <h2 className="mt-5 font-display text-lg font-semibold uppercase tracking-wide text-gb-mute">{label}</h2>
      <div className="mt-1 font-display text-3xl font-bold break-words text-gb-navy">{value}</div>
      <p className="mt-3 text-gb-mute">{children}</p>
      <div className="mt-auto flex flex-col gap-3 pt-6">{actions}</div>
    </div>
  );
}

export default function ContatoPage() {
  return (
    <>
      <PageHeader title="Contato" description="Ligue ou chame no WhatsApp para tirar dúvidas e agendar sua aula experimental." />

      <section aria-label="Formas de contato" className="bg-gb-line/40 py-16 sm:py-20">
        <Container className="grid gap-6 lg:grid-cols-3">
          <ContactCard
            icon={PhoneIcon}
            label="Telefone e WhatsApp"
            value={
              <a href={phoneUrl} className="focus-ring tabular-nums hover:text-gb-red">
                {contact.displayPhone}
              </a>
            }
            actions={
              <>
                <ButtonLink href={whatsappTrialUrl} external>
                  {primaryCta.label}
                </ButtonLink>
                <div className="grid grid-cols-2 gap-3">
                  <ButtonLink href={whatsappUrl(`Olá! Tenho uma dúvida sobre a ${site.name}.`)} external variant="outline" className="px-3">
                    <WhatsAppIcon className="h-5 w-5 shrink-0" /> WhatsApp
                  </ButtonLink>
                  <ButtonLink href={phoneUrl} variant="outline" className="px-3">
                    <PhoneIcon className="h-5 w-5 shrink-0" /> Ligar
                  </ButtonLink>
                </div>
              </>
            }
          >
            O WhatsApp abre com uma mensagem pronta. O horário da aula é combinado na conversa com a equipe.
          </ContactCard>

          <ContactCard
            icon={MailIcon}
            label="E-mail"
            value={
              // Quebra só depois do "@" (nunca no meio do nome) quando o card é estreito.
              <a href={emailUrl} className="focus-ring hover:text-gb-red">
                {emailUser}@<wbr />
                {emailDomain}
              </a>
            }
            actions={
              <ButtonLink href={emailUrl} variant="outline">
                Enviar e-mail
              </ButtonLink>
            }
          >
            Para assuntos que pedem mais detalhes, parcerias e documentos.
          </ContactCard>

          {site.social.instagram && (
            <ContactCard
              icon={InstagramIcon}
              label="Instagram"
              value={instagramHandle}
              actions={
                <ButtonLink href={site.social.instagram} external variant="outline">
                  Seguir no Instagram
                </ButtonLink>
              }
            >
              Treinos, graduações e novidades da equipe.
            </ContactCard>
          )}
        </Container>
      </section>

      <section aria-labelledby="onde-estamos" className="py-16 sm:py-20">
        <Container>
          <h2 id="onde-estamos" className="font-display text-4xl font-bold uppercase sm:text-5xl">
            Onde estamos
          </h2>
          <div className="mt-8 grid border-2 border-gb-ink lg:grid-cols-[22rem_1fr]">
            <div className="flex flex-col bg-gb-ink p-6 text-gb-white sm:p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center bg-gb-red">
                <MapPinIcon className="h-6 w-6" />
              </span>
              <address className="mt-5 text-lg not-italic leading-relaxed">
                <span className="block font-display text-3xl font-bold leading-tight">{site.address.street}</span>
                <span className="mt-2 block">
                  {site.neighborhood}, {site.city}–{site.state}
                </span>
                <span className="block">CEP {site.address.postalCode}</span>
              </address>
              <div className="mt-auto flex flex-col gap-3 pt-8">
                <ButtonLink href={maps.directionsUrl} external>
                  Como chegar
                </ButtonLink>
                <ButtonLink href={maps.profileUrl} external variant="outline-light">
                  Ver no Google
                </ButtonLink>
              </div>
            </div>
            <iframe
              src={maps.embedUrl}
              title={`Mapa: ${fullAddress}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-80 w-full sm:h-[26rem] lg:h-full lg:min-h-[26rem]"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
