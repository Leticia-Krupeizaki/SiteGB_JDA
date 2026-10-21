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

/** Título e descrição do cartão de compartilhamento (e do Google). */
const shareTitle = `${site.name} — Jiu-Jitsu em ${site.city}`;
const shareDescription = `Escola oficial Gracie Barra, certificada Premium. Jiu-Jitsu Para Todos: aulas para crianças, adultos e mulheres no ${site.neighborhood}, ${site.city}–${site.state}. Agende sua aula experimental.`;

export const metadata: Metadata = {
  title: {
    default: shareTitle,
    template: `%s | ${site.name}`,
  },
  description: shareDescription,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  /*
   * Cartão de pré-visualização ao compartilhar o link (WhatsApp, Instagram,
   * Facebook, LinkedIn...). A imagem vem de src/app/opengraph-image.png (logo da
   * unidade, 1200x630) e vale para todas as páginas.
   */
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: site.name,
    title: shareTitle,
    description: shareDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: shareTitle,
    description: shareDescription,
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
