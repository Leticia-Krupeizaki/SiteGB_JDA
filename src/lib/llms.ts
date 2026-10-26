import { contact, instagramHandle, site, siteUrl, whatsappTrialUrl } from '@/config/site';
import { about } from '@/data/about';
import { curriculumGroups } from '@/data/curriculums';
import { legacy, legacyWall } from '@/data/legacy';
import { programs, trainingFocuses } from '@/data/programs';
import { classLabel, schedule, scheduleDisclaimer, scheduleValidFrom, weekdays } from '@/data/schedule';

/**
 * Conteúdo do /llms.txt (padrão llmstxt.org): resumo em Markdown para IAs e buscadores
 * de IA entenderem o site. Gerado dos mesmos dados das páginas, então nunca fica
 * desatualizado. Só informações confirmadas: o que falta aparece como "a confirmar".
 */
const url = (path: string) => new URL(path, siteUrl).toString();
const date = (iso: string) => iso.split('-').reverse().join('/');

export function buildLlmsTxt(): string {
  const lines: string[] = [];
  const push = (...l: string[]) => lines.push(...l);

  push(
    `# ${site.name}`,
    '',
    `> Escola oficial Gracie Barra de Jiu-Jitsu, certificada como Escola Premium (2026), no bairro ${site.neighborhood}, em ${site.city}–${site.state}, Brasil. Aulas para crianças (GBK), adultos (GB1 e GB2), mulheres (turma exclusiva) e treino sem kimono (No-Gi), de segunda a sexta-feira. Aula experimental agendada pelo WhatsApp.`,
    '',
    `${about.lead} ${about.paragraphs[0]}`,
    '',
    '## Informações principais',
    '',
    `- Nome: ${site.name}`,
    `- Rede: Gracie Barra (fundada em 1986 pelo Mestre Carlos Gracie Jr.). Missão: "Jiu-Jitsu Para Todos". Valores: Irmandade, Integridade e Desenvolvimento.`,
    `- Fundação da unidade: 7 de abril de 2025, por Fabio Daurélio Gusso`,
    `- Localização: ${site.neighborhood}, ${site.city}–${site.state}. Endereço completo: a confirmar (consulte pelo WhatsApp).`,
    `- Telefone e WhatsApp: ${contact.displayPhone}`,
    `- Agendar aula experimental: ${whatsappTrialUrl}`,
    ...(site.social.instagram ? [`- Instagram: [${instagramHandle}](${site.social.instagram})`] : []),
    `- Site: ${url('/')}`,
    '',
    '## Turmas',
    '',
    ...programs.map((p) => `- ${p.label}: ${p.audience}. ${p.description}`),
    ...trainingFocuses.map((f) => `- Foco "${f.label}": ${f.description}`),
    '',
    `## Grade de horários (vigente desde ${date(scheduleValidFrom)})`,
    '',
    `${scheduleDisclaimer} ${instagramHandle}. Não há aulas aos sábados e domingos.`,
    '',
  );
  for (const day of weekdays) {
    push(`### ${day.label}`, '');
    for (const b of schedule[day.id]) {
      const extras = [b.ageGroup, b.note].filter(Boolean).join(', ');
      push(`- ${b.start}–${b.end}: ${classLabel(b.classes)}${extras ? ` (${extras})` : ''}`);
    }
    push('');
  }

  push(
    '## Páginas',
    '',
    `- [Início](${url('/')}): apresentação, valores e aulas do dia`,
    `- [A Academia](${url('/sobre')}): história da unidade e o legado Gracie Barra`,
    `- [Programas](${url('/programas')}): turmas, currículos de treino e focos de treino`,
    `- [Horários](${url('/horarios')}): grade semanal completa, com filtro por turma`,
    `- [Mural](${url('/mural')}): fotos da comunidade, enviadas pelos alunos e revisadas pela equipe`,
    `- [Contato](${url('/contato')}): telefone, WhatsApp e Instagram`,
    '',
    '## Currículos de treino',
    '',
    `Currículos oficiais Gracie Barra: 16 semanas de aulas, com as técnicas das aulas A e B. Só para visualização no site, em ${url('/programas#curriculos')}.`,
    '',
  );
  for (const group of curriculumGroups) {
    for (const c of group.items) {
      push(`- Currículo ${c.title}: ${c.audience ?? group.title}; versão ${c.version}`);
    }
  }

  push(
    '',
    '## Legado Gracie Barra',
    '',
    legacy.intro[0],
    '',
    ...legacyWall.map((m) => `- ${m.name}: ${m.role}`),
    '',
    '## Optional',
    '',
    `- [Encontre outra escola Gracie Barra](https://graciebarra.com/brasil/encontre-uma-escola/): busca oficial de unidades no Brasil`,
    `- [Gracie Barra Brasil, sobre nós](https://graciebarra.com/brasil/sobre-nos/): história oficial da rede`,
    '',
  );
  return lines.join('\n');
}
