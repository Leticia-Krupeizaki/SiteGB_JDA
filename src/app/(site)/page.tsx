import Link from 'next/link';
import { BenefitCard } from '@/components/home/BenefitCard';
import { ContactCTA } from '@/components/home/ContactCTA';
import { Hero } from '@/components/home/Hero';
import { ProgramCard } from '@/components/home/ProgramCard';
import { TeacherPlaceholderCard } from '@/components/home/TeacherCard';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { ExternalLinkCard } from '@/components/ui/ExternalLinkCard';
import { ArrowRightIcon } from '@/components/ui/icons';
import { PlaceholderNotice } from '@/components/ui/PlaceholderNotice';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { contact, phoneUrl } from '@/config/site';
import { benefits } from '@/data/benefits';
import { externalLinks } from '@/data/external-links';
import { programs } from '@/data/programs';

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="A academia"
            title="Gracie Barra no Jardim das Américas"
            description="Uma unidade da Gracie Barra em Curitiba, com aulas de Jiu-Jitsu para crianças, adultos e uma turma exclusiva para mulheres."
          />
          <div className="space-y-4">
            <PlaceholderNotice>A história e os diferenciais da unidade serão publicados após envio e aprovação do cliente.</PlaceholderNotice>
            <Link href="/sobre" className="focus-ring inline-flex items-center gap-2 rounded font-semibold text-brand-red hover:text-brand-red-dark">
              Conheça a academia <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-neutral-100 py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Por que treinar" title="O que o Jiu-Jitsu desenvolve" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {benefits.map((benefit, index) => (
              <BenefitCard key={benefit.title} index={index + 1} {...benefit} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="Turmas" title="Treino para cada fase" description="Turmas conforme a grade oficial da unidade." />
            <ButtonLink href="/programas" variant="secondary">
              Ver programas
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {programs.map((program) => (
              <ProgramCard key={program.code} program={program} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-neutral-900 py-16 text-white sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            tone="dark"
            eyebrow="Horários"
            title="Aulas de segunda a sexta"
            description="Turmas de manhã, no horário de almoço e à noite. Veja a grade completa e escolha o melhor horário para você."
          />
          <div className="lg:justify-self-end">
            <ButtonLink href="/horarios" variant="inverted">
              Ver grade de horários
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Equipe" title="Professores" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TeacherPlaceholderCard />
            <TeacherPlaceholderCard />
            <TeacherPlaceholderCard />
          </div>
        </Container>
      </section>

      <section className="bg-neutral-100 py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Mural da comunidade"
            title="Nosso tatame, nossa história"
            description="Fotos de treinos, graduações, campeonatos e eventos enviadas pelos alunos. Toda foto passa pela equipe antes de aparecer no mural."
          />
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-self-end">
            <ButtonLink href="/mural">Compartilhar minha foto</ButtonLink>
            <ButtonLink href="/mural" variant="secondary">
              Ver o mural
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Ecossistema"
            title="Plataformas e federações"
            description="Links para plataformas da Gracie Barra e federações de Jiu-Jitsu."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {externalLinks.map((link) => (
              <ExternalLinkCard key={link.url} link={link} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2">
          <SectionHeading eyebrow="Localização" title="Onde estamos" description="Jardim das Américas, Curitiba–PR." />
          <div className="space-y-4">
            <PlaceholderNotice>Endereço completo e mapa serão exibidos após confirmação do cliente.</PlaceholderNotice>
            <p className="text-neutral-600">
              Enquanto isso, fale com a gente pelo telefone{' '}
              <a href={phoneUrl} className="focus-ring rounded font-semibold text-brand-red">
                {contact.displayPhone}
              </a>
              .
            </p>
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
