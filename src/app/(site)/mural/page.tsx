import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { MuralActions } from '@/components/mural/MuralActions';
import { MuralGallery } from '@/components/mural/MuralGallery';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { muralLimits } from '@/data/mural';
import { listPublicPosts } from '@/lib/mural/posts';

/** Sempre do banco: uma foto removida some na hora, sem esperar cache. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mural',
  description: 'Mural da comunidade da Gracie Barra Jardim das Américas: fotos de treinos, graduações, campeonatos e eventos enviadas pelos alunos.',
  alternates: { canonical: '/mural' },
};

const steps = [
  { title: 'Você envia', text: 'Preencha o formulário com a foto, a categoria e as autorizações. Não precisa de cadastro.' },
  { title: 'A equipe revisa', text: 'Toda foto é analisada antes de qualquer publicação. Fotos com menores de idade exigem autorização dos responsáveis.' },
  { title: 'A foto aparece', text: 'Só fotos aprovadas entram no mural. Fotos recusadas não são publicadas.' },
];

export default async function MuralPage() {
  const firstPage = await listPublicPosts({ limit: muralLimits.pageSize });

  return (
    <>
      <PageHeader
        title="Nosso tatame, nossa história"
        description="Treinos, graduações, campeonatos e eventos registrados pelos próprios alunos."
      />

      <section className="bg-gb-line/60 py-12 sm:py-16">
        <Container>
          <MuralGallery initial={firstPage} />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading title="Como funciona" />
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="border-t-4 border-gb-navy pt-4">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-gb-mute">Passo {i + 1}</p>
                <h3 className="mt-1 font-display text-2xl font-bold uppercase">{step.title}</h3>
                <p className="mt-2 text-gb-mute">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* `enviar` e `retirar` também são âncoras: o botão da Home leva a /mural#enviar. */}
      <section id="participar" className="scroll-mt-24 border-t border-gb-line py-16 sm:py-20">
        <span id="enviar" className="block scroll-mt-24" aria-hidden />
        <span id="retirar" className="block scroll-mt-24" aria-hidden />
        <Container className="space-y-8">
          <SectionHeading title="Participe do mural" description="Envie sua foto sem cadastro, ou peça a retirada de uma foto em que você aparece." />
          <MuralActions />
        </Container>
      </section>
    </>
  );
}
