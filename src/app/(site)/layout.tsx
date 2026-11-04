import type { ReactNode } from 'react';
import { TodayPopup } from '@/components/home/TodayPopup';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipLink } from '@/components/layout/SkipLink';
import { WhatsAppFloatingButton } from '@/components/layout/WhatsAppFloatingButton';
import { contact, maps, site, siteUrl } from '@/config/site';
import { getSiteImages } from '@/lib/content/site-images';

/** Dados estruturados da unidade (schema.org), para o Google mostrar endereço e contato nas buscas locais. Só constantes do site (sem texto de visitante). */
const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'SportsActivityLocation',
  name: site.name,
  url: siteUrl,
  telephone: contact.phoneE164,
  email: contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.city,
    addressRegion: site.state,
    postalCode: site.address.postalCode,
    addressCountry: 'BR',
  },
  hasMap: maps.profileUrl,
  sameAs: Object.values(site.social),
};

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const logo = (await getSiteImages())['marca-logo-escola'];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      <SkipLink />
      <Header logo={logo} />
      <main id="conteudo" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppFloatingButton />
      <TodayPopup />
    </>
  );
}
