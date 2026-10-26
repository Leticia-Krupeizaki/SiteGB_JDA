import type { StaticImageData } from 'next/image';
import founderWithChildren from '@/assets/historia/fundador-com-filhos.jpg';

/**
 * "Nossa história": texto ORIGINAL enviado pelo cliente em 19/10/2026, narrado
 * pelo fundador. Mantido como veio. Trechos entre *asteriscos* são os destaques
 * marcados pelo cliente e aparecem em itálico (ver `Emphasis` na página).
 */
export const history = {
  founder: 'Fabio Daurélio Gusso',
  lead: 'Uma história de família, um sonho e um legado.',
  paragraphs: [
    'No dia 7 de abril de 2025, nasceu oficialmente a Gracie Barra Premium Jardim das Américas, um projeto idealizado e fundado por Fabio Daurélio Gusso, com o propósito de levar a filosofia e os valores da Gracie Barra a um bairro que, até então, não contava com uma escola da equipe.',
    'Mas essa história começou antes mesmo de a escola existir. Começou com um sonho, muitas ideias e a vontade de construir algo significativo. *Desde o início, quando ainda não tínhamos nada além desse sonho, meu filho, Fabio Daurélio Gusso Filho, esteve ao meu lado.* Juntos, acompanhamos os primeiros passos, enfrentamos os desafios e trabalhamos para transformar uma ideia em realidade. Como pai, poder compartilhar essa jornada com meu filho é uma das partes mais especiais dessa conquista.',
    'Nossa história também carrega as raízes da nossa família. A casa onde hoje funciona a escola foi adquirida pelo meu pai muitos anos atrás e, com o tempo, ganhou um novo propósito: tornou-se um espaço dedicado ao Jiu-Jitsu, à educação e à transformação de vidas. É gratificante ver um patrimônio construído por uma geração servir de base para os sonhos das gerações seguintes.',
    'Hoje, minha filha, *Maria Fernanda Gusso*, também faz parte desse projeto, trabalhando conosco e treinando Jiu-Jitsu. Ter meus dois filhos presentes nessa caminhada torna tudo ainda mais especial. Mais do que construir uma escola, estamos compartilhando experiências, transmitindo valores e criando uma história que desejamos levar adiante.',
    'Inspirados pelo legado da Gracie Barra, buscamos cultivar os princípios de *respeito, disciplina, integridade, irmandade, superação e desenvolvimento humano*. Acreditamos que a irmandade vai além dos tatames: está no apoio mútuo, na união diante dos desafios e na compreensão de que crescemos ainda mais quando ajudamos uns aos outros a evoluir.',
    'Para mim, a GB Premium Jardim das Américas representa muito mais do que um empreendimento. É a união entre a história do meu pai, um sonho construído ao lado do meu filho e a participação da minha filha em uma jornada que continua crescendo. É a oportunidade de transformar uma conquista familiar em algo que também faça a diferença na vida de tantas outras famílias.',
  ],
  /** Frase de legado, em destaque como citação. */
  quote:
    'Porque o verdadeiro legado não está apenas naquilo que construímos, mas nos valores que transmitimos, nas pessoas que ajudamos a formar e nas histórias que deixamos para as próximas gerações.',
  invitation: [
    'E é com esse propósito que convidamos você e sua família a fazerem parte da nossa história. Queremos que a GB Premium Jardim das Américas seja também a casa de vocês: um lugar para aprender, superar desafios, construir amizades e crescer juntos. Seja para seus filhos, para você ou para toda a família, o Jiu-Jitsu pode ser o começo de uma transformação que vai muito além dos tatames.',
    '*As portas da nossa escola estão abertas. Será uma alegria receber sua família e construir, juntos, novos capítulos dessa história.*',
  ],
  tagline: 'Gracie Barra Premium Jardim das Américas — tradição no tatame, irmandade na caminhada e um legado construído em família.',
  signature: 'Idealização, fundação e propriedade: Fabio Daurélio Gusso.',
  /** Foto do fundador com os filhos, enviada pelo cliente em 26/10/2026. */
  photo: {
    src: founderWithChildren,
    alt: 'Fabio Daurélio Gusso de kimono branco e faixa azul, sorrindo e abraçado aos filhos, um de cada lado, no tatame da academia, sob o símbolo da Gracie Barra iluminado na parede.',
  } as null | { src: StaticImageData; alt: string },
  photoCaption: 'Fabio Daurélio Gusso, fundador, com os filhos Fabio Daurélio Gusso Filho e Maria Fernanda Gusso.',
};
