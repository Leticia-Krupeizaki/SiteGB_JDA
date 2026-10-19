import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { site, siteUrl } from '@/config/site';
import './globals.css';

/*
 * FONTE PROVISÓRIA: D-DIN (Datto, SIL Open Font License 1.1; licença em
 * src/app/fonts/D-DIN-LICENSE-OFL.txt). É da mesma família DIN da fonte oficial.
 * O Manual de Uso da Marca (p. 15–16) exige AdiHaus DIN; quando os arquivos
 * licenciados chegarem, trocar os `src` abaixo mantendo as variáveis
 * --font-body (AdihausDIN) e --font-condensed (AdihausDIN Cn).
 * Passo a passo em docs/IDENTIDADE-VISUAL.md.
 *
 * A D-DIN só tem 400 e 700: pesos 500/600/800 usados nas classes caem no peso
 * real mais próximo (sem negrito artificial; ver font-synthesis em globals.css).
 */
const body = localFont({
  variable: '--font-body',
  display: 'swap',
  src: [
    { path: './fonts/D-DIN.woff2', weight: '400', style: 'normal' },
    { path: './fonts/D-DIN-Italic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/D-DIN-Bold.woff2', weight: '700', style: 'normal' },
  ],
});

const condensed = localFont({
  variable: '--font-condensed',
  display: 'swap',
  src: [
    { path: './fonts/D-DINCondensed.woff2', weight: '400', style: 'normal' },
    { path: './fonts/D-DINCondensed-Bold.woff2', weight: '700', style: 'normal' },
  ],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Jiu-Jitsu em ${site.city}`,
    template: `%s | ${site.name}`,
  },
  description: `Jiu-Jitsu na ${site.name}, ${site.city}–${site.state}. Aulas para crianças, adultos e mulheres. Agende sua aula experimental.`,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: site.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${body.variable} ${condensed.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
