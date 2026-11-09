import type { Metadata } from 'next';
import { ContactCTA } from '@/components/home/ContactCTA';
import { PageHeader } from '@/components/layout/PageHeader';
import { Container } from '@/components/ui/Container';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { PlaceholderNotice } from '@/components/ui/PlaceholderNotice';
import { SitePhoto } from '@/components/ui/SitePhoto';
import { site } from '@/config/site';
import { instructors } from '@/data/instructors';
import { getSiteImages } from '@/lib/content/site-images';

export const metadata: Metadata = {
  title: 'Professores',
  description: `Equipe de professores da ${site.name}.`,
  alternates: { canonical: '/professores' },
};

export default async function ProfessoresPage() {
  const images = await getSiteImages();

  return (
    <>
      <PageHeader title="Professores" description="Conheça a equipe que conduz os treinos da unidade." />
      <section className="py-16 sm:py-20">
        <Container>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {instructors.map((instructor) => {
              const photo = images[`professor-${instructor.id}`];
              return (
                <li key={instructor.id} className="flex flex-col">
                  {/* Ampliação leve ao passar o mouse, como na foto de "Muito além do tatame". */}
                  {photo ? (
                    <div className="group overflow-hidden">
                      <SitePhoto
                        image={photo}
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="aspect-[3/4] h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <PhotoPlaceholder label="Foto a definir" className="aspect-[3/4] w-full" />
                  )}
                  <h2 className="mt-5 border-t-4 border-gb-red pt-4 font-display text-2xl leading-tight font-bold uppercase">{instructor.name}</h2>
                  <div className="mt-3">
                    {instructor.bio ? (
                      <p className="leading-relaxed text-gb-mute">{instructor.bio}</p>
                    ) : (
                      <PlaceholderNotice>breve descrição, a enviar pelo cliente.</PlaceholderNotice>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
      <ContactCTA />
    </>
  );
}
