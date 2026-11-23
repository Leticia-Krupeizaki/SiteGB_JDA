# Gracie Barra Jardim das Américas — Website

Site institucional da unidade Gracie Barra Jardim das Américas (Curitiba–PR): apresentação da academia, programas, professores, grade de horários, mural da comunidade e contato via WhatsApp.

**Site 100% estático** (desde 23/11/2026): o build gera HTML, CSS, JS e imagens na pasta `out/`, servida por nginx. Não há servidor de aplicação, banco de dados, armazenamento externo nem painel administrativo.

## Stack

- [Next.js](https://nextjs.org/) (App Router, `output: 'export'`) + TypeScript
- Tailwind CSS v4
- Vitest (testes)
- nginx (hospedagem, ver [`nginx.conf`](nginx.conf))

## Requisitos

- Node.js 20 ou superior
- npm

## Como rodar

```bash
npm install
npm run dev        # http://localhost:3000
```

Outros comandos:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build      # gera o site estático em out/
npm start          # serve a pasta out/ para conferir o resultado
```

## Como atualizar o conteúdo

Todo o conteúdo fica no código; cada mudança é um commit seguido de deploy.

| O quê | Onde |
|---|---|
| Fotos do site (topo, unidade, estrutura, professores, legado, selo, logo) | arquivo em `src/assets/` + `src/data/site-images.ts` |
| Fotos do mural | arquivo em `public/fotos/mural/` + `src/data/mural.ts` |
| Professores (frase, credenciais, biografia) | `src/data/instructors.ts` |
| Grade de horários | `src/data/schedule.ts` |
| Currículos de treino | imagens em `src/assets/curriculos/` + `src/data/curriculums.ts` |
| Dados da unidade, contato e links | `src/config/` |

Cada arquivo de dados explica, no comentário do topo, o formato e o tamanho das imagens.

## Deploy

Produção roda no **Coolify** com Docker Compose (um único serviço: build do site + nginx). Passo a passo em [`docs/DEPLOY-COOLIFY.md`](docs/DEPLOY-COOLIFY.md).

## Estrutura e próximos passos

O mapa dos arquivos, o que já foi feito e o que falta está em [`docs/PROXIMOS-PASSOS.md`](docs/PROXIMOS-PASSOS.md).

## Conteúdo provisório

Fotos da unidade e dos professores ainda não foram fornecidas pelo cliente. Até lá, o site mostra os quadros "Foto a definir". Não inventar esses dados nem usar fotos genéricas como se fossem da unidade.

## Contribuição

- Trabalho direto na `main`.
- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat:`, `fix:`, `docs:`...).
- Nunca versionar `.env`, chaves ou imagens privadas.
