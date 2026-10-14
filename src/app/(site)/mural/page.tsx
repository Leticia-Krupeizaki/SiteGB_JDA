import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { DemoNotice } from '@/components/mural/DemoNotice';
import { MuralGallery } from '@/components/mural/MuralGallery';
import { PhotoUploadForm } from '@/components/mural/PhotoUploadForm';
import { Container } from '@/components/ui/Container';
import { PlaceholderNotice } from '@/components/ui/PlaceholderNotice';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { whatsappUrl } from '@/config/site';

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

const removalUrl = whatsappUrl('Olá! Gostaria de pedir a retirada de uma foto do mural da Gracie Barra Jardim das Américas.');

export default function MuralPage() {
  return (
    <>
      <PageHeader
        title="Nosso tatame, nossa história"
        description="Treinos, graduações, campeonatos e eventos registrados pelos próprios alunos."
      />

      <section className="bg-gb-line/60 py-12 sm:py-16">
        <Container className="space-y-8">
          <DemoNotice>
            O mural ainda não está ligado a um servidor. Os quadros abaixo são exemplos de layout, não fotos de alunos, e o formulário apenas
            testa os campos: nada é salvo nem publicado.
          </DemoNotice>
          <MuralGallery />
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

      <section id="enviar" className="scroll-mt-24 border-t border-gb-line py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <SectionHeading title="Compartilhar minha foto" description="Envie sem cadastro. A foto só aparece no mural depois de aprovada pela equipe." />
            <div className="space-y-3 text-sm text-gb-mute">
              <h3 className="font-display text-xl font-bold uppercase text-gb-ink">Privacidade</h3>
              <p>Seu contato é usado só pela equipe e nunca aparece no site. Nome e legenda só são exibidos com a sua autorização.</p>
              <p>
                Quer retirar uma foto publicada?{' '}
                <a href={removalUrl} target="_blank" rel="noopener noreferrer" className="focus-ring font-semibold text-gb-navy underline">
                  Peça a retirada pelo WhatsApp
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                .
              </p>
              <PlaceholderNotice>texto final da política de privacidade e do termo de autorização de imagem, a ser aprovado pelo cliente.</PlaceholderNotice>
            </div>
          </div>
          <PhotoUploadForm />
        </Container>
      </section>
    </>
  );
}
