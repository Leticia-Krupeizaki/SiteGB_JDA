import Link from 'next/link';
import { mainNavigation } from '@/config/navigation';
import { contact, phoneUrl, site, whatsappTrialUrl } from '@/config/site';
import { externalLinks } from '@/data/external-links';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    // pb extra no celular para o botão flutuante do WhatsApp não cobrir o conteúdo.
    <footer className="bg-neutral-900 pt-14 pb-24 text-neutral-300 sm:pb-10">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo tone="light" />
            <p className="mt-4 text-sm leading-relaxed">
              Jiu-Jitsu no bairro {site.neighborhood}, em {site.city}–{site.state}.
            </p>
          </div>

          <nav aria-label="Rodapé">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white">Navegação</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="focus-ring rounded hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white">Ecossistema</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {externalLinks.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="focus-ring rounded hover:text-white">
                    {link.name}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white">Contato</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={phoneUrl} className="focus-ring rounded hover:text-white">
                  Telefone: {contact.displayPhone}
                </a>
              </li>
              <li>
                <a href={whatsappTrialUrl} target="_blank" rel="noopener noreferrer" className="focus-ring rounded hover:text-white">
                  WhatsApp: {contact.displayPhone}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li className="text-neutral-400">Endereço: em breve</li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-neutral-800 pt-6 text-xs text-neutral-400">
          © {year} {site.name}. Site em desenvolvimento, com conteúdo provisório sujeito à aprovação.
        </p>
      </Container>
    </footer>
  );
}
