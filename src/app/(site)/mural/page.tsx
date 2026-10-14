import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Mural',
  description: 'Mural da comunidade da Gracie Barra Jardim das Américas: fotos de treinos, graduações e eventos.',
};

// Galeria, filtros e formulário de envio (em modo demonstração) entram na Etapa 3.
export default function MuralPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mural da comunidade"
        title="Nosso tatame, nossa história"
        description="Fotos de treinos, graduações, campeonatos e eventos enviadas pelos alunos, sempre revisadas pela equipe antes da publicação."
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-100 p-10 text-center">
            <p className="font-display text-2xl uppercase">Ainda não há fotos publicadas</p>
            <p className="mx-auto mt-2 max-w-md text-neutral-600">
              O envio de fotos estará disponível em breve. Nenhuma foto é publicada sem aprovação da equipe.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
