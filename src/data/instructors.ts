/**
 * Professores da unidade (nomes enviados pelo cliente em 09/11/2026; textos em
 * 18/11/2026; o Fabio é chamado de "Fabinho"). Fotos em src/data/site-images.ts (chave
 * `professor-<id>`). Sem `quote`/`bio`, o card mostra o aviso "a confirmar" e não
 * se expande.
 */
export type Instructor = {
  id: string;
  name: string;
  /** Linha de credenciais do texto do cliente ("Faixa-Preta Gracie Barra | Professora | ..."). */
  credentials: string[];
  /** "Sua mensagem para quem deseja começar", sem as aspas. */
  quote: string | null;
  /** Biografia, um item por parágrafo. */
  bio: string[];
};

export const instructors: Instructor[] = [
  {
    id: 'samayra-da-silva-zaura',
    name: 'Samayra da Silva Zaura',
    credentials: ['Faixa-Preta Gracie Barra', 'Professora', 'Atleta de Competição'],
    quote:
      'Não tenha medo de dar o primeiro passo. Ninguém precisa chegar pronto ao tatame. É nele que aprendemos, evoluímos, construímos amizades e descobrimos capacidades que muitas vezes nem sabíamos possuir.',
    bio: [
      'Conhecida como Sam, iniciou no Jiu-Jitsu aos 12 anos, em 2013, na Gracie Barra Alta Floresta (MT). Aos 20 anos, mudou-se para Curitiba, aprofundando sua formação na Casa GB e no Instituto Jiu-Jitsu Para Todos, sob orientação de Ademir Ohta, Nika Schwinden e Pimpolho. Faixa-preta desde 2023, possui certificação PCI Gracie Barra desde 2019.',
      'Entre suas conquistas estão o tricampeonato Brasileiro CompNet (2024, 2025 e 2026), o bronze no Sul-Americano CBJJ 2024, os vice-campeonatos Sul-Americano No-Gi e Brasileiro ADCC 2026, além da liderança do ranking brasileiro IBJJF 2026 na categoria faixa-preta leve. Também acumula títulos no Floripa Open e Curitiba Open, em Gi e No-Gi.',
      'Como professora, valoriza o respeito à individualidade, a disciplina e a evolução diária. Na Gracie Barra Premium Jardim das Américas, dedica-se especialmente às turmas infantis e ao fortalecimento do Jiu-Jitsu feminino, promovendo confiança, respeito e desenvolvimento pessoal.',
    ],
  },
  {
    id: 'flavio-souza',
    name: 'Flávio Souza',
    credentials: ['Faixa-Preta Gracie Barra', 'Professor de Jiu-Jitsu'],
    quote: 'Comecem já! Uma das frases que mais escuto dos alunos é: por que eu não comecei a praticar Jiu-Jitsu antes?',
    bio: [
      'Flávio Rodrigues de Souza iniciou no Jiu-Jitsu aos 12 anos, em 1988, na Barra da Tijuca (RJ), sob orientação de Totila Jordan Neto (Pitoco). Após competir na juventude, ingressou na carreira militar pela Academia Militar das Agulhas Negras (AMAN), tornando-se oficial do Exército Brasileiro e permanecendo 24 anos afastado dos tatames.',
      'Em 2015, retomou sua paixão pelo Jiu-Jitsu, tendo como principal referência o professor Dalmir César de Souza. Na Gracie Barra Ponta Grossa, conquistou a faixa-marrom sob orientação dos professores Alexandre e William. Mesmo após superar cirurgias no joelho e no quadril, persistiu e conquistou a faixa-preta em 2021.',
      'Desde 2024, atua como professor, inicialmente em parceria com Dalmir, mantendo sua formação atualizada pelo Instituto Gracie Barra. Na Gracie Barra Premium Jardim das Américas, dedica-se ao desenvolvimento dos alunos, valorizando disciplina, humildade, autocontrole, respeito e cuidado com os parceiros. Sua missão é transmitir o legado da equipe, fundamentado em Irmandade, Integridade e Desenvolvimento, levando os ensinamentos do tatame para a vida.',
    ],
  },
  {
    id: 'renan-antunes-de-sa',
    name: 'Renan Antunes de Sá',
    credentials: ['Professor de Jiu-Jitsu', 'Atleta de Competição', 'Gracie Barra'],
    quote:
      'Comece, respeite seu próprio ritmo e não compare sua evolução com a de outras pessoas. Cada um tem seu tempo. O importante é continuar treinando e aproveitar o processo.',
    bio: [
      'Renan Antunes de Sá iniciou no Jiu-Jitsu aos 16 anos, em 11 de junho de 2014, na Gracie Barra Hauer, em Curitiba, sob orientação do professor Francisco Valente. Ao longo de sua trajetória, também teve como referência o professor Osmar Carioca, desenvolvendo sua formação técnica e competitiva.',
      'Entre suas conquistas estão o título de Campeão Paranaense Adulto Faixa-Preta, na categoria até 88 kg, além de posições no pódio do Curitiba International Open, Floripa International Open e CompNet. Sua experiência inclui uma passagem pela Alemanha, onde treinou e ministrou aulas, ampliando seus conhecimentos na modalidade.',
      'Desde 2023, atua como professor, valorizando a didática, a paciência e o desenvolvimento técnico. Na Gracie Barra Premium Jardim das Américas, busca formar alunos preparados, ensinando não apenas como executar cada técnica, mas também quando e por que utilizá-la. Sua filosofia é baseada no respeito, na disciplina, na humildade e na evolução constante, acreditando que o aprendizado nunca termina.',
    ],
  },
  {
    id: 'fabio-daurelio-gusso-filho',
    name: 'Fabio Daurelio Gusso Filho',
    credentials: ['Professor de Jiu-Jitsu', 'Atleta', 'Gracie Barra'],
    quote: 'Não existe idade certa para começar. Cada um tem seu tempo e sempre haverá algo novo para aprender. Afinal, amanhã sempre será mais tarde do que hoje!',
    bio: [
      'Fabio Daurelio, conhecido como Fabinho, iniciou sua trajetória no Jiu-Jitsu aos 17 anos, buscando bem-estar e desenvolvimento pessoal. Com o tempo, encontrou no esporte uma paixão marcada pelo aprendizado e pela superação. Um dos momentos mais especiais de sua caminhada foi acompanhar a graduação de seu próprio pai. Em sua formação, destaca a influência dos professores Dalmir e Samayra.',
      'Como atleta, conquistou o título de Campeão Paranaense na categoria até 100,5 kg e o terceiro lugar no Curitiba Open No-Gi. Há aproximadamente dois anos, iniciou sua atuação como professor, desenvolvendo uma abordagem dinâmica e didática, especialmente no ensino infantil.',
      'Na Gracie Barra Premium Jardim das Américas, busca proporcionar aulas acolhedoras e envolventes, valorizando o respeito, as diferenças individuais e o ritmo de evolução de cada aluno. Sua filosofia é baseada na dedicação, na constância e no aprendizado contínuo, acreditando que o Jiu-Jitsu vai muito além das técnicas, promovendo crescimento pessoal e espírito de família.',
    ],
  },
];
