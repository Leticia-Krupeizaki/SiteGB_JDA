import Link from 'next/link';
import { mainNavigation } from '@/config/navigation';
import { contact, emailUrl, instagramHandle, maps, phoneUrl, site, whatsappTrialUrl } from '@/config/site';
import { InstagramIcon } from '@/components/ui/icons';
import { PremiumSeal } from '@/components/ui/PremiumSeal';
import { SitePhoto } from '@/components/ui/SitePhoto';
import { externalLinks } from '@/data/external-links';
import { getSiteImages } from '@/lib/content/site-images';
import { Belt } from '@/components/ui/Belt';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';

const headingClass = 'font-display text-lg font-semibold uppercase tracking-wide text-gb-white';

export async function Footer() {
  const year = new Date().getFullYear();
  const schoolLogo = (await getSiteImages())['marca-logo-escola'];

  return (
    <footer className="bg-gb-ink text-gb-line">
      <Belt />
      {/* pb extra no celular para o botão flutuante do WhatsApp não cobrir o conteúdo. */}
      <Container className="pt-14 pb-24 sm:pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="light" premium />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Jiu-Jitsu no {site.neighborhood}, {site.city}–{site.state}.
            </p>
            {/*
             * Logo da escola (arquivo do cliente, assets/marca/logo-jda.pdf, com disco branco
             * atrás para o texto preto do anel aparecer no fundo preto) ao lado do selo Premium.
             * Os dois são trocáveis no painel (Fotos do site → Marca).
             */}
            <div className="mt-6 flex items-center gap-5">
              {schoolLogo && <SitePhoto image={schoolLogo} sizes="96px" className="h-auto w-24" />}
              <PremiumSeal sizes="96px" className="w-24" />
            </div>
          </div>

          <nav aria-label="Rodapé">
            <h2 className={headingClass}>Site</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="focus-ring hover:text-gb-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={headingClass}>Links úteis</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {externalLinks.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="focus-ring hover:text-gb-white">
                    {link.name}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={headingClass}>Contato</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={phoneUrl} className="focus-ring hover:text-gb-white">
                  Telefone e WhatsApp {contact.displayPhone}
                </a>
              </li>
              <li>
                <a href={whatsappTrialUrl} target="_blank" rel="noopener noreferrer" className="focus-ring hover:text-gb-white">
                  Falar no WhatsApp
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={emailUrl} className="focus-ring break-all hover:text-gb-white">
                  <span className="sr-only">E-mail </span>
                  {contact.email}
                </a>
              </li>
              {site.social.instagram && (
                <li>
                  <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-1.5 hover:text-gb-white">
                    <InstagramIcon className="h-4 w-4" />
                    <span className="sr-only">Instagram </span>
                    {instagramHandle}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
              )}
              <li>
                <a href={maps.directionsUrl} target="_blank" rel="noopener noreferrer" className="focus-ring hover:text-gb-white">
                  {site.address.street}
                  <br />
                  {site.neighborhood}, {site.city}–{site.state}
                  <br />
                  CEP {site.address.postalCode}
                  <span className="sr-only"> (rota no Google Maps, abre em nova aba)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-gb-white/15 pt-6 text-xs">
          © {year} {site.name}. Versão em desenvolvimento; textos e imagens sujeitos à aprovação.
        </p>
      </Container>
    </footer>
  );
}
