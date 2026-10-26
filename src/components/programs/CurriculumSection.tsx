import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { curriculumGroups } from '@/data/curriculums';
import { CurriculumCard } from './CurriculumCard';

/** Currículos oficiais por semana, só para visualização (página Programas). */
export function CurriculumSection() {
  return (
    <section aria-labelledby="curriculos" className="py-16 sm:py-20">
      <Container>
        <div id="curriculos" className="scroll-mt-24">
          <SectionHeading
            title="Currículos de treino"
            description="Veja o que é ensinado em cada semana. Cada currículo Gracie Barra organiza 16 semanas de aulas, com as técnicas das aulas A e B."
          />
        </div>
        {curriculumGroups.map((group) => (
          <div key={group.title} className="mt-10">
            <h3 className="font-display text-2xl font-bold uppercase text-gb-navy">{group.title}</h3>
            <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {group.items.map((curriculum) => (
                <CurriculumCard key={curriculum.slug} curriculum={curriculum} />
              ))}
            </ul>
          </div>
        ))}
      </Container>
    </section>
  );
}
