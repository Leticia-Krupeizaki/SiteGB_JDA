# Gracie Barra Jardim das Américas — Website

Site institucional da unidade Gracie Barra Jardim das Américas (Curitiba–PR): apresentação da academia, programas, grade de horários, mural da comunidade moderado e contato via WhatsApp.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS v4
- Zod (validação) e Vitest (testes)
- Fase B (mural funcional): PostgreSQL + Prisma, storage S3 compatível privado, autenticação administrativa

## Requisitos

- Node.js 20 ou superior
- npm

## Como rodar

```bash
npm install
cp .env.example .env.local   # opcional na Fase A
npm run dev                  # http://localhost:3000
```

Outros comandos:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build && npm start
```

## Estrutura e próximos passos

O mapa completo dos arquivos, o que já foi feito e tudo o que falta (backend do mural, painel administrativo, deploy e pendências do cliente) está em [`docs/PROXIMOS-PASSOS.md`](docs/PROXIMOS-PASSOS.md).

Dados da unidade, grade de horários, turmas e links externos ficam em `src/config` e `src/data`, separados do layout.

## Conteúdo provisório

Endereço, redes sociais, logotipo, professores, história da unidade e fotos ainda não foram fornecidos pelo cliente. Até lá, o site usa placeholders identificados. Não inventar esses dados.

## Contribuição

- Trabalho direto na `main`.
- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat:`, `fix:`, `docs:`...).
- Nunca versionar `.env`, chaves ou imagens privadas.
