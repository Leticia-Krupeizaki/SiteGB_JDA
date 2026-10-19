/**
 * "Nossa história", texto enviado pelo cliente em 19/10/2026 (narrado pelo
 * fundador). Correções só de digitação e pontuação; nomes como enviados.
 */
export const history = {
  lead: 'Uma história de família, um sonho e um legado.',
  paragraphs: [
    'Mas nossa história começou bem antes. Começou com um sonho, ideias e vontade de construir algo significativo. Tive o apoio do meu filho Fabio dauréli Gusso Filho, que esteve sempre ao meu lado, e juntos enfrentamos os desafios e demos os primeiros passos para transformar uma ideia em realidade. Poder compartilhar essa jornada com meu filho é uma das partes mais especiais dessa conquista.',
    'Mas nossa história carrega as raízes de nossa família. A casa que hoje é nossa escola foi adquirida anos antes pelo meu pai, e agora ganhou um outro propósito: se tornou um local dedicado ao Jiu-Jitsu, à educação e a transformar vidas através dessa arte. É de grande gratidão ver um patrimônio construído por uma geração servir aos sonhos da geração futura.',
    'Hoje minha filha Maria Fernanda Gusso também faz parte desse projeto, trabalhando conosco e treinando Jiu-Jitsu. Ter meus dois filhos juntos comigo nessa trajetória é mais do que especial. Mais do que construir uma escola, estamos criando a nossa história e dividindo valores.',
    'Nos inspiramos no legado da Gracie Barra, cultivando os princípios de respeito, disciplina, integridade, irmandade, superação e desenvolvimento. Acreditamos que a irmandade vai além dos tatames: está no apoio, na união e em nos ajudar a evoluir.',
    'Para mim, a GB Premium Jardim das Américas representa muito mais que um empreendimento: é a junção da história do meu pai e a construção da minha história junto dos meus filhos. É a oportunidade de fazer a diferença na vida de outras famílias.',
  ],
  /** Fecho em destaque. */
  invitation: [
    'Por isso convidamos você e sua família para fazer parte da nossa história.',
    'As portas da nossa escola estão abertas. Será uma alegria receber sua família e construir, juntos, novos capítulos dessa história.',
  ],
  /**
   * Foto do fundador com os filhos. Pendente: quando chegar, colocar o arquivo
   * em src/assets/ e importar aqui (ex.: `photo: fotoFundador`), com o texto
   * alternativo abaixo descrevendo quem aparece.
   */
  photo: null as null | { src: import('next/image').StaticImageData; alt: string },
  photoCaption: 'O fundador com os filhos, Fabio e Maria Fernanda.',
};
