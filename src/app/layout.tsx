import type { Metadata } from 'next';
import { Inter, Oswald } from 'next/font/google';
import { site } from '@/config/site';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
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
    <html lang="pt-BR" className={`${inter.variable} ${oswald.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
