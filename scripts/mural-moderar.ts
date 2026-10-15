/**
 * Moderação PROVISÓRIA por linha de comando, para testes locais até o painel
 * administrativo (Etapa 5). Usa as mesmas regras que o painel vai usar.
 *
 *   npm run mural:moderar -- listar
 *   npm run mural:moderar -- aprovar <id> [--responsavel-recebido]
 *   npm run mural:moderar -- aguardar <id>
 *   npm run mural:moderar -- rejeitar <id> "motivo"
 *   npm run mural:moderar -- remover <id> "motivo"
 */
import { db } from '@/lib/db/client';
import { ModerationError, approvePost, markAwaitingGuardian, rejectPost, removePost } from '@/lib/mural/moderation';

const [command, id, ...rest] = process.argv.slice(2);

async function main() {
  switch (command) {
    case 'listar': {
      const posts = await db().muralPost.findMany({
        orderBy: { createdAt: 'desc' },
        take: 30,
        select: { id: true, status: true, category: true, studentName: true, createdAt: true },
      });
      if (posts.length === 0) console.log('Nenhum envio ainda.');
      for (const p of posts) console.log(`${p.id}  ${p.status.padEnd(31)} ${p.category.padEnd(12)} ${p.createdAt.toLocaleString('pt-BR')}  ${p.studentName}`);
      return;
    }
    case 'aprovar':
      await approvePost(id, {
        guardianAuthorizationStatus: rest.includes('--responsavel-recebido') ? 'RECEIVED' : 'NOT_REQUIRED',
        thirdPartyRightsReviewed: true,
      });
      return console.log('Aprovada. A foto já aparece no mural.');
    case 'aguardar':
      await markAwaitingGuardian(id);
      return console.log('Marcada como aguardando autorização dos responsáveis.');
    case 'rejeitar':
      await rejectPost(id, rest.join(' '));
      return console.log('Rejeitada.');
    case 'remover':
      await removePost(id, rest.join(' ') || 'Removida pela equipe');
      return console.log('Removida do mural.');
    default:
      console.log('Comandos: listar | aprovar <id> [--responsavel-recebido] | aguardar <id> | rejeitar <id> "motivo" | remover <id> "motivo"');
  }
}

main()
  .catch((error) => {
    console.error(error instanceof ModerationError ? `Erro: ${error.message}` : error);
    process.exitCode = 1;
  })
  .finally(() => db().$disconnect());
