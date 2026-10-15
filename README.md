# Gracie Barra Jardim das Américas — Website

Site institucional da unidade Gracie Barra Jardim das Américas (Curitiba–PR): apresentação da academia, programas, grade de horários, mural da comunidade moderado e contato via WhatsApp.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS v4
- Zod (validação) e Vitest (testes)
- Mural: PostgreSQL + Prisma 7, storage compatível com S3 (bucket privado + bucket público só para aprovadas), `sharp` e `file-type` no upload

## Requisitos

- Node.js 20 ou superior
- npm
- Docker (para o banco e o storage locais do mural)

## Como rodar

```bash
npm install                  # também gera o cliente do Prisma
cp .env.example .env.local   # os valores padrão batem com o docker-compose.yml
docker compose up -d         # PostgreSQL (5432) e storage S3 local (8333)
npm run db:migrate           # aplica as migrações
npm run storage:init         # cria os buckets locais
npm run dev                  # http://localhost:3000
```

Sem banco configurado, todas as páginas funcionam, menos `/mural` e as APIs do mural.

Outros comandos:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build && npm start
```

## Painel administrativo

A moderação do mural fica em `/admin` (sem link no site público). As contas são criadas por linha de comando; a senha é gerada e mostrada uma única vez:

```bash
npm run admin -- criar equipe@exemplo.com ADMIN Nome da Pessoa   # ou MODERATOR
npm run admin -- listar
npm run admin -- nova-senha equipe@exemplo.com    # encerra as sessões abertas
npm run admin -- desativar equipe@exemplo.com     # encerra as sessões abertas
```

Em produção (Coolify), o mesmo script roda no terminal do container: `node scripts/admin.mjs criar ...`.

## Deploy

Produção roda no **Coolify** com Docker Compose (site + PostgreSQL + storage SeaweedFS). Passo a passo em [`docs/DEPLOY-COOLIFY.md`](docs/DEPLOY-COOLIFY.md). As migrações são aplicadas sozinhas quando o container inicia.

## Estrutura e próximos passos

O mapa completo dos arquivos, o que já foi feito e tudo o que falta (backend do mural, painel administrativo, deploy e pendências do cliente) está em [`docs/PROXIMOS-PASSOS.md`](docs/PROXIMOS-PASSOS.md).

Dados da unidade, grade de horários, turmas e links externos ficam em `src/config` e `src/data`, separados do layout.

## Conteúdo provisório

Endereço, redes sociais, logotipo, professores, história da unidade e fotos ainda não foram fornecidos pelo cliente. Até lá, o site usa placeholders identificados. Não inventar esses dados.

## Contribuição

- Trabalho direto na `main`.
- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat:`, `fix:`, `docs:`...).
- Nunca versionar `.env`, chaves ou imagens privadas.
