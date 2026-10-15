import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipLink } from '@/components/layout/SkipLink';
import { TopBar } from '@/components/layout/TopBar';
import { WhatsAppFloatingButton } from '@/components/layout/WhatsAppFloatingButton';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <TopBar />
      <Header />
      <main id="conteudo" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
