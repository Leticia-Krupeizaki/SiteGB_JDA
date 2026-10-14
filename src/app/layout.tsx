import type { Metadata } from 'next';
import { Barlow, Barlow_Condensed } from 'next/font/google';
import { site } from '@/config/site';
import './globals.css';

const body = Barlow({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const condensed = Barlow_Condensed({
  variable: '--font-condensed',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Jiu-Jitsu em ${site.city}`,
    template: `%s | ${site.name}`,
  },
  description: `Jiu-Jitsu na ${site.name}, ${site.city}–${site.state}. Agende sua aula experimental.`,
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
