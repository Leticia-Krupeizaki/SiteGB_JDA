import { statSync } from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { curriculumGroups, type Curriculum } from '@/data/curriculums';

/** Tamanho real do PDF publicado (lido do arquivo, para nunca ficar desatualizado). */
function fileSize(file: string): string {
  const bytes = statSync(path.join(process.cwd(), 'public', file)).size;
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB` : `${Math.round(bytes / 1024)} KB`;
}

const buttonBase = 'focus-ring inline-flex min-h-11 flex-1 items-center justify-center px-3 font-display text-base font-semibold uppercase tracking-wide transition-colors';

function CurriculumCard({ curriculum }: { curriculum: Curriculum }) {
  const name = `Currículo ${curriculum.title}`;
  return (
    <li className="flex flex-col bg-gb-white">
      {/* Miniatura clicável: abre o PDF. Decorativa para leitor de tela (o botão "Ver" já descreve a ação). */}
      <a href={curriculum.file} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden className="block border-b border-gb-line">
        <Image src={curriculum.preview} alt="" sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 90vw" className="h-auto w-full" />
      </a>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="font-display text-2xl font-bold uppercase leading-tight">{name}</h4>
        {curriculum.audience && <p className="mt-1 text-sm text-gb-mute">{curriculum.audience}</p>}
        <p className="mt-2 text-sm text-gb-mute">
          16 semanas · Aulas A e B · Versão {curriculum.version}
        </p>
        <div className="mt-auto flex gap-2 pt-4">
          <a href={curriculum.file} target="_blank" rel="noopener noreferrer" className={`${buttonBase} border-2 border-gb-ink text-gb-ink hover:bg-gb-ink hover:text-gb-white`}>
            Ver
            <span className="sr-only"> o {name} (PDF, abre em nova aba)</span>
          </a>
          <a href={curriculum.file} download={`${curriculum.slug}.pdf`} className={`${buttonBase} bg-gb-red text-gb-white hover:bg-gb-red-dark`}>
            Baixar
            <span className="sr-only"> o {name}</span>
          </a>
        </div>
        <p className="mt-2 text-center text-xs text-gb-mute">PDF · {fileSize(curriculum.file)}</p>
      </div>
    </li>
  );
}

/** Currículos oficiais por semana, com visualização e download (página Programas). */
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
