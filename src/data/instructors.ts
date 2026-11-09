/**
 * Professores da unidade (nomes enviados pelo cliente em 09/11/2026). Fotos pelo
 * painel (Fotos do site → Professores, chave `professor-<id>`). `bio`: descrição
 * curta, a preencher quando o cliente enviar; sem ela o card mostra o aviso "a confirmar".
 */
export type Instructor = {
  id: string;
  name: string;
  bio: string | null;
};

export const instructors: Instructor[] = [
  { id: 'samayra-da-silva-zaura', name: 'Samayra da Silva Zaura', bio: null },
  { id: 'flavio-souza', name: 'Flavio Souza', bio: null },
  { id: 'renan-antunes-de-sa', name: 'Renan Antunes de Sá', bio: null },
  { id: 'fabio-daurelio-gusso-filho', name: 'Fabio Daurelio Gusso Filho', bio: null },
];
