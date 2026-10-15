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
npm run mural:moderar -- listar          # moderação provisória até o painel (Etapa 5)
npm run mural:moderar -- aprovar <id>
npm run mural:moderar -- remover <id> "motivo"
```

Em produção, aplique as migrações com `npm run db:deploy` e configure as variáveis de `.env.example` na hospedagem.

## Estrutura e próximos passos

O mapa completo dos arquivos, o que já foi feito e tudo o que falta (backend do mural, painel administrativo, deploy e pendências do cliente) está em [`docs/PROXIMOS-PASSOS.md`](docs/PROXIMOS-PASSOS.md).

Dados da unidade, grade de horários, turmas e links externos ficam em `src/config` e `src/data`, separados do layout.

## Conteúdo provisório

Endereço, redes sociais, logotipo, professores, história da unidade e fotos ainda não foram fornecidos pelo cliente. Até lá, o site usa placeholders identificados. Não inventar esses dados.

## Contribuição

- Trabalho direto na `main`.
- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat:`, `fix:`, `docs:`...).
- Nunca versionar `.env`, chaves ou imagens privadas.
