/**
 * Método Gracie Barra (texto enviado pelo cliente em 09/11/2026), página Programas.
 * Os quatro programas são os da metodologia GB, não a grade da unidade (ver programs.ts).
 */
export const method = {
  title: 'Método Gracie Barra',
  tagline: 'Jiu-Jitsu para Todos®',
  lead: 'Uma metodologia reconhecida, estruturada e aplicada em mais de 1.000 escolas ao redor do mundo.',
  paragraphs: [
    'O Método Gracie Barra foi desenvolvido para proporcionar uma experiência de aprendizado completa, organizada e progressiva, permitindo que crianças, jovens e adultos desenvolvam suas habilidades no Jiu-Jitsu de maneira segura, consistente e respeitando o próprio ritmo.',
    'Mais do que ensinar técnicas de defesa pessoal, nossa metodologia busca promover o desenvolvimento físico, mental e emocional, incentivando valores essenciais como disciplina, respeito, autoconfiança, autocontrole e superação.',
  ],
  values: ['Disciplina', 'Respeito', 'Autoconfiança', 'Autocontrole', 'Superação'],
  journey: {
    title: 'Uma jornada de evolução contínua',
    description:
      'O sistema de ensino da Gracie Barra é dividido em quatro programas, estruturados para acompanhar cada etapa do desenvolvimento do aluno:',
  },
  beyond: {
    title: 'Muito além do tatame',
    paragraphs: [
      'A metodologia Gracie Barra oferece uma jornada de aprendizado estruturada, na qual cada etapa representa uma oportunidade de evolução e conquista.',
      'Com programas progressivos e um padrão de ensino consolidado internacionalmente, buscamos garantir qualidade, consistência e continuidade no aprendizado, criando um ambiente acolhedor e motivador para todos.',
      'Na Gracie Barra, acreditamos que o Jiu-Jitsu é para todos. Independentemente da idade, experiência ou condicionamento físico, cada aluno tem a oportunidade de descobrir seu potencial e desenvolver habilidades que vão muito além do tatame.',
    ],
    signature: 'Gracie Barra — Jiu-Jitsu para Todos®',
  },
};

export type MethodProgram = {
  code: 'GBK' | 'GB1' | 'GB2' | 'GB3';
  name: string;
  description: string;
  /** Faixa de cor do card: as três primeiras seguem a grade; GB3 em preto (faixa preta). */
  color: string;
  /** Ponta vermelha da faixa preta. */
  redTip?: boolean;
};

export const methodPrograms: MethodProgram[] = [
  {
    code: 'GBK',
    name: 'Gracie Barra Kids',
    description:
      'Voltado ao desenvolvimento infantil, estimula a coordenação motora, a disciplina, o respeito e o aprendizado dos primeiros fundamentos do Jiu-Jitsu.',
    color: 'bg-green-700',
  },
  {
    code: 'GB1',
    name: 'Fundamentos',
    description:
      'Apresenta os princípios essenciais da arte suave, construindo uma base técnica sólida para que o aluno desenvolva confiança, compreensão e segurança durante os treinos.',
    color: 'bg-gb-blue',
  },
  {
    code: 'GB2',
    name: 'Jiu-Jitsu Avançado',
    description:
      'Proporciona o aperfeiçoamento das técnicas, o desenvolvimento estratégico e uma compreensão mais profunda das diferentes situações de combate.',
    color: 'bg-violet-600',
  },
  {
    code: 'GB3',
    name: 'Programa Faixa Preta',
    description:
      'Direcionado ao domínio técnico, à excelência e ao aprimoramento contínuo, proporcionando um treinamento de alto nível para praticantes experientes.',
    color: 'bg-gb-ink',
    redTip: true,
  },
];
