/**
 * Contas do painel administrativo. A senha é gerada aleatoriamente e mostrada
 * UMA vez; entregue-a por canal seguro.
 *
 *   npm run admin -- listar
 *   npm run admin -- criar <email> [ADMIN|MODERATOR] [nome...]
 *   npm run admin -- nova-senha <email>      (revoga as sessões abertas)
 *   npm run admin -- desativar <email>       (revoga as sessões abertas)
 *   npm run admin -- reativar <email>
 */
import { generatePassword, hashPassword } from '@/lib/auth/password';
import { db } from '@/lib/db/client';

const [command, rawEmail, ...rest] = process.argv.slice(2);
const email = rawEmail?.trim().toLowerCase();

async function revokeSessions(adminId: string) {
  await db().adminSession.updateMany({ where: { adminId, revokedAt: null }, data: { revokedAt: new Date() } });
}

async function findAdmin() {
  if (!email) throw new Error('Informe o e-mail.');
  const admin = await db().admin.findUnique({ where: { email } });
  if (!admin) throw new Error(`Nenhuma conta com o e-mail ${email}.`);
  return admin;
}

function showPassword(password: string) {
  console.log(`\nSenha: ${password}\n(mostrada só agora; entregue por canal seguro e peça para guardar em um gerenciador de senhas)`);
}

async function main() {
  switch (command) {
    case 'listar': {
      const admins = await db().admin.findMany({ orderBy: { createdAt: 'asc' } });
      if (admins.length === 0) console.log('Nenhuma conta ainda.');
      for (const a of admins) console.log(`${a.email.padEnd(36)} ${a.role.padEnd(10)} ${a.disabledAt ? 'DESATIVADA' : 'ativa'}  ${a.name ?? ''}`);
      return;
    }
    case 'criar': {
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('Informe um e-mail válido.');
      const role = rest[0] === 'ADMIN' || rest[0] === 'MODERATOR' ? rest.shift()! : 'MODERATOR';
      const password = generatePassword();
      await db().admin.create({
        data: { email, role: role as 'ADMIN' | 'MODERATOR', name: rest.join(' ') || null, passwordHash: await hashPassword(password) },
      });
      console.log(`Conta criada: ${email} (${role})`);
      return showPassword(password);
    }
    case 'nova-senha': {
      const admin = await findAdmin();
      const password = generatePassword();
      await db().admin.update({ where: { id: admin.id }, data: { passwordHash: await hashPassword(password) } });
      await revokeSessions(admin.id);
      console.log(`Senha trocada para ${admin.email}; sessões abertas encerradas.`);
      return showPassword(password);
    }
    case 'desativar': {
      const admin = await findAdmin();
      await db().admin.update({ where: { id: admin.id }, data: { disabledAt: new Date() } });
      await revokeSessions(admin.id);
      return console.log(`Conta ${admin.email} desativada; sessões encerradas.`);
    }
    case 'reativar': {
      const admin = await findAdmin();
      await db().admin.update({ where: { id: admin.id }, data: { disabledAt: null } });
      return console.log(`Conta ${admin.email} reativada.`);
    }
    default:
      console.log('Comandos: listar | criar <email> [ADMIN|MODERATOR] [nome] | nova-senha <email> | desativar <email> | reativar <email>');
  }
}

main()
  .catch((error) => {
    console.error(`Erro: ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
  })
  .finally(() => db().$disconnect());
