import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { MuralGallery } from '@/components/mural/MuralGallery';
import { Container } from '@/components/ui/Container';
import { site, whatsappUrl } from '@/config/site';
import { muralPosts } from '@/data/mural';

export const metadata: Metadata = {
  title: 'Mural',
  description: `Mural da comunidade da ${site.name}: fotos de treinos, graduações, campeonatos e eventos.`,
  alternates: { canonical: '/mural' },
};

const removalWhatsapp = whatsappUrl(`Olá! Gostaria de pedir a retirada de uma foto do mural da ${site.name}.`);

export default function MuralPage() {
  return (
    <>
      <PageHeader title="Nosso tatame, nossa história" description="Treinos, graduações, campeonatos e eventos da nossa comunidade." />

      <section className="bg-gb-line/60 py-12 sm:py-16">
        <Container>
          <MuralGallery posts={muralPosts} />
        </Container>
      </section>

      <section id="retirar" className="scroll-mt-24 border-t border-gb-line py-12 sm:py-16">
        <Container>
          <div className="max-w-2xl border-l-4 border-gb-navy pl-5">
            <h2 className="font-display text-2xl font-bold uppercase">Aparece em uma foto e quer retirá-la?</h2>
            <p className="mt-2 text-gb-mute">
              Fale com a equipe pelo WhatsApp informando qual é a foto. Ela sai do mural assim que o pedido for confirmado.
            </p>
            <a
              href={removalWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-4 inline-flex min-h-12 items-center border-2 border-gb-ink px-5 font-display text-lg font-semibold uppercase hover:bg-gb-ink hover:text-gb-white"
            >
              Pedir retirada pelo WhatsApp
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
