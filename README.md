# Gracie Barra Jardim das Américas — Website

Site institucional da unidade Gracie Barra Jardim das Américas (Curitiba–PR): apresentação da academia, programas, grade de horários, mural da comunidade moderado e contato via WhatsApp.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS
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
npm run build && npm start
```

## Estrutura

```text
src/
  app/            # rotas (App Router)
  config/
    site.ts       # nome, telefone, WhatsApp e dados da unidade
    navigation.ts # menu principal e CTA
  data/
    external-links.ts # plataformas e federações
```

Dados da unidade, telefone e links externos ficam centralizados em `src/config` e `src/data` para serem alterados sem mexer no layout.

## Conteúdo provisório

Endereço, redes sociais, logotipo, professores, história da unidade e fotos ainda não foram fornecidos pelo cliente. Até lá, o site usa placeholders identificados. Não inventar esses dados.

## Contribuição

- Trabalho em branches com Pull Request para a `main`.
- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat:`, `fix:`, `docs:`...).
- Nunca versionar `.env`, chaves ou imagens privadas.
