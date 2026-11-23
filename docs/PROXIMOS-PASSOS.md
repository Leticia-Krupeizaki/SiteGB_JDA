# Próximos passos — Site Gracie Barra Jardim das Américas

> **23/11/2026 — o site virou 100% estático.** Saíram o backend do mural, o painel `/admin`, o banco (PostgreSQL/Prisma), o storage (SeaweedFS) e as APIs (Etapas 4 e 5 abaixo ficam só como histórico; o código continua no git, antes do commit da migração). Hoje:
> - Fotos do site, currículos e fotos do mural são arquivos do projeto; como atualizar está no [README](../README.md#como-atualizar-o-conteúdo).
> - O mural é uma galeria fixa (`src/data/mural.ts`), sem envio pelo site (pedidos de retirada chegam pelos contatos gerais da academia).
> - Hospedagem: nginx num único serviço do Coolify ([DEPLOY-COOLIFY.md](DEPLOY-COOLIFY.md)).

> Estado em 14/10/2026: Etapas 4 e 5 implementadas e testadas localmente (banco e storage em Docker).
> Documento para continuar o desenvolvimento localmente (VS Code).
> A especificação completa é a fonte dos requisitos; as seções citadas abaixo (ex.: "spec §9") se referem a ela.

---

## 1. Resumo rápido

| Etapa | Escopo | Situação |
|---|---|---|
| 0 | Esqueleto Next.js + config central | ✅ Concluída |
| 1 | Fundação visual, layout, Home e páginas base | ✅ Concluída |
| 2 | Grade de horários, filtros, SEO básico | ✅ Concluída |
| 3 | Mural público em **modo demonstração** | ✅ Concluída |
| 4 | Backend do mural (banco, storage, upload seguro, APIs) | ✅ Concluída localmente · falta infraestrutura de produção (4.1) |
| 5 | Painel administrativo de moderação | ✅ Concluída localmente · faltam as contas reais da equipe |
| 6 | Qualidade, acessibilidade, deploy e homologação | ⬜ A fazer |

As etapas 0 a 3 formam o **protótipo apresentável (Fase A)**. As etapas 4 a 6 são a **Fase B** (mural funcional e produção).

---

## 2. Como rodar localmente

```bash
git clone https://github.com/Leticia-Krupeizaki/SiteGB_JDA.git
cd SiteGB_JDA
npm install
npm run dev        # http://localhost:3000
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Checagem de tipos |
| `npm test` | Vitest (14 testes: grade e validação do mural) |
| `npm run build && npm start` | Build e servidor de produção |

Requisitos: Node.js 20+ e npm. Nenhuma variável de ambiente é obrigatória na Fase A.

Extensões úteis no VS Code: ESLint, Tailwind CSS IntelliSense, Vitest.

---

## 3. O que já existe

### Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (tokens em `src/app/globals.css`, bloco `@theme`)
- Zod 3 (validação compartilhável entre formulário e API)
- Vitest 3 (testes unitários)
- Fontes: D-DIN Condensed (títulos) e D-DIN (texto) via `next/font/local`, provisórias até a AdiHaus DIN oficial (`docs/IDENTIDADE-VISUAL.md`)

### Mapa de arquivos

```text
src/
  app/
    layout.tsx              # fontes, metadata global, Open Graph, metadataBase
    globals.css             # paleta (gb-red, gb-navy, gb-ink, gb-line...), focus-ring, marquee
    robots.ts / sitemap.ts  # SEO (domínio vem de NEXT_PUBLIC_SITE_URL)
    (site)/
      layout.tsx            # Header, Footer, SkipLink, botão flutuante do WhatsApp
      page.tsx              # Home
      sobre/ programas/ professores/ horarios/ mural/ contato/
  components/
    layout/                 # Header (menu mobile), Footer, Logo, PageHeader, SkipLink, WhatsAppFloatingButton
    home/                   # Hero, TodayOnMat, ProgramList, ValuesBand, ContactCTA
    schedules/              # ScheduleBoard (abas + filtros), ScheduleClassCard
    mural/                  # MuralGallery, PhotoLightbox, PhotoUploadForm, DemoPhotoTile, DemoNotice
    ui/                     # Belt (faixa com graus), ButtonLink, Container, SectionHeading,
                            # PlaceholderNotice, PhotoPlaceholder, ExternalLinkCard, icons
  config/
    site.ts                 # nome, telefone, WhatsApp (whatsappUrl, whatsappTrialUrl), siteUrl
    navigation.ts           # menu principal e CTA
  data/
    schedule.ts             # GRADE OFICIAL a partir de 10/08/2026 (27 blocos) + faixas de horário + cores por turma
    programs.ts             # turmas (legenda da grade) e focos de treino
    benefits.ts             # benefícios exibidos na Home/Sobre
    external-links.ts       # plataformas e federações
    mural.ts                # categorias, limites, versões dos termos, itens de demonstração
  lib/
    schedule.ts             # filterBlocks, defaultDay (lógica pura, testada)
    validation/mural.ts     # muralSubmissionSchema (Zod) e validatePhotoFile
  types/
    mural.ts                # MuralStatus, MuralCategory, PublicMuralPost
tests/
  schedule.test.ts          # grade bloco a bloco contra o PDF, filtros, dia padrão, links
  mural.test.ts             # schema do formulário, arquivo, dados de demonstração
```

### Decisões já tomadas (não reverter sem falar com o cliente)

- **Nome oficial: "Gracie Barra Premium Jardim das Américas"** (certificação Premium em 2026, confirmado em 19/10/2026). Centralizado em `site.name` (`src/config/site.ts`); textos, SEO e mensagens do WhatsApp usam a variável. O cabeçalho mostra só "Gracie Barra / Jardim das Américas" por falta de espaço; o rodapé mostra "Premium".
- **Identidade visual segue o Manual de Uso da Marca GB (23/09/2025)** desde 16/10/2026: vermelho `#E1251B`, azul `#11286D`, preto, cinzas K65/K45, branco. Tokens, contraste, logotipos e pendências em [`IDENTIDADE-VISUAL.md`](IDENTIDADE-VISUAL.md). (Antes: `#D71921`, `#002F80`, `#111111`.)
- **Visual inspirado no site da Gracie Barra Brasil**, sem copiar textos, imagens ou código. A **faixa com graus** (`Belt.tsx`) separa as seções.
- **Cores auxiliares por turma** (Contexto.md): GBK verde, GB1 azul (oficial), GB2 roxo, GBF rosa, No-Gi cinza (oficial). Verde, roxo e rosa estão fora da paleta do manual: pendente de confirmação.
- **Telefone único (19/10/2026, pedido do cliente):** (41) 3205-8109 para ligação e WhatsApp (`554132058109`). O celular (41) 99683-1171, usado entre 15 e 19/10, saiu do site. Mensagens sempre com `encodeURIComponent` (use `whatsappUrl()`).
- **Trabalho direto na `main`**, Conventional Commits em português.
- **Nada de dados inventados:** endereço, professores, fotos, história e depoimentos aparecem como "A confirmar" (`PlaceholderNotice`) até o cliente enviar.

---

## 4. Etapa 4 — Backend do mural (Fase B)

Objetivo: o envio público passa a ser real, mas **nenhuma foto fica pública sem aprovação** (spec §9, §10, §11, §12).

### 4.1 Decisões que precisam vir antes (cliente)

- [x] Hospedagem: **Coolify** (já em uso pelo cliente), recurso Docker Compose — ver `docs/DEPLOY-COOLIFY.md`
- [x] Banco PostgreSQL: serviço `db` dentro do mesmo compose
- [x] Storage S3: **SeaweedFS** como serviço `storage` no mesmo compose
- [ ] Domínio final (para `NEXT_PUBLIC_SITE_URL`)
- [ ] Texto final da política de privacidade e do termo de autorização de imagem (versões em `src/data/mural.ts → muralPolicyVersions`)
- [ ] Política de retenção e exclusão de fotos rejeitadas/removidas

### 4.2 O que foi implementado (resumo)

- **Prisma 7** (`prisma.config.ts`, cliente gerado em `src/generated/prisma`, adapter `pg`). Fixado em 7.x; o 8 ainda é RC.
- **Ambiente local** em `docker-compose.yml`: PostgreSQL 17 e SeaweedFS (S3). A imagem do MinIO saiu do Docker Hub, por isso SeaweedFS.
- **Regras de moderação** em `src/lib/mural/moderation.ts`, usadas pelo painel da Etapa 5. (Houve um moderador provisório por CLI, removido quando o painel ficou pronto.)
- **Teste ponta a ponta manual** feito contra o servidor local: envio, recusa de arquivo falso, PENDING invisível na API e no HTML, aprovação, remoção, pedido de retirada e rate limit.

### 4.3 Banco de dados (Prisma)

- [x] `prisma/schema.prisma` com:
  - `Admin` (id UUID, email único, passwordHash ou providerId, role, createdAt, updatedAt)
  - `MuralPost` (campos da spec §10: studentName, contactType, contactValue, caption, category, status, originalObjectKey, publicObjectKey, privacyPolicyVersion, privacyAcceptedAt, publicationConsentVersion, publicationConsentAt, guardianAuthorizationStatus, thirdPartyRightsReviewed, approvedAt, moderatedBy, rejectionReason, createdAt, updatedAt, removedAt, além de `showNamePublicly` e `showCaptionPublicly` se o cliente quiser controlar a exibição)
  - `MuralModerationEvent` (postId, adminId, action, previousStatus, nextStatus, reason, createdAt)
  - `MuralRemovalRequest` (postId?, requesterContact, reason, status, createdAt, resolvedAt, resolutionNote)
  - Enums: `MuralStatus`, `MuralCategory`, `ContactType` — **alinhar com `src/types/mural.ts`**
  - Índices `(status, createdAt)` e `(category, status, createdAt)`, mais `(status, approvedAt)` para a galeria
  - Extras: `width`/`height` (evita CLS), `GuardianAuthorizationStatus`, `ModerationAction`, `RateLimitHit`
- [x] `src/lib/db/client.ts` com singleton do Prisma (criado só no primeiro uso; o build não precisa de banco)
- [x] Migração inicial versionada (`prisma/migrations/…_init`)

### 4.4 Armazenamento de imagens

- [x] `src/lib/storage/` com `putObject`, `getObjectBytes`, `getSignedUrl` (URL temporária), `deleteObject`, `publicUrl`
- [x] Bucket **privado** para originais e pendentes; derivado público só gerado **após aprovação** (`approvePost`)
- [x] Nomes de objeto por UUID, nunca o nome original do arquivo
- [x] Credenciais só em variáveis de ambiente, nunca expostas ao navegador (conferido: leitura anônima do bucket privado dá 403)

### 4.5 Upload seguro (`POST /api/mural`)

- [x] `src/app/api/mural/route.ts` recebendo `multipart/form-data`
- [x] Reaproveita `muralSubmissionSchema` e `muralFormValues` (mesmo código no navegador e na API)
- [x] Limite de tamanho de request (`Content-Length`, 413) e de arquivo (10 MB)
- [x] Magic bytes com `file-type`
- [x] `sharp` com `.rotate()` + reencode WebP, sem EXIF/GPS; arquivos corrompidos recusados (`src/lib/mural/image.ts`)
- [x] Limite de 40 megapixels processáveis; cópia privada com no máximo 4000 px de lado
- [x] Honeypot preenchido responde 201 falso e descarta
- [x] Rate limiting em tabela do banco, 5/hora por IP com HMAC (`src/lib/rate-limit/`)
- [x] Grava `PENDING`, versões e datas dos aceites, e evento `SUBMITTED`
- [x] Responde `201 { id, status: 'PENDING' }`, sem URL pública
- [x] Erros `{ code, message, fieldErrors? }`: 400, 411, 413, 415, 422, 429, 500
- [x] Logs só com tipo e mensagem do erro (`logServerError`)

### 4.6 APIs públicas restantes

- [x] `GET /api/mural?category=&cursor=&limit=12` — só `APPROVED`, só campos publicáveis, paginação por cursor
- [x] `GET /api/mural/categories`
- [x] `POST /api/mural/removal-requests` — formulário na página do mural (WhatsApp segue como alternativa)

### 4.7 Trocar a demonstração pelo real no front

- [x] `PhotoUploadForm.tsx` envia para a API, mostra erros por campo, estado de envio e erro de rede
- [x] `MuralGallery.tsx`: primeira página no servidor (`/mural` é dinâmica), filtros e "Carregar mais" pela API, `next/image` com `width/height`
- [x] Nome só com o checkbox "Pode mostrar meu nome"; legenda aparece se preenchida (avisado no formulário)
- [x] Removidos `DemoNotice`, `DemoPhotoTile` e `demoMuralPosts`; galeria vazia mostra convite para enviar
- [x] Testes atualizados (`tests/mural.test.ts`) e novos testes de imagem e payload público (`tests/mural-server.test.ts`)
- [x] Prévia da Home (`MuralPreview`) mostra as 2 últimas aprovadas; sem fotos, mantém os quadros
- [x] Seção "Participe do mural" com dois botões, **Enviar uma foto** e **Pedir remoção de foto** (`MuralActions.tsx`); `/mural#enviar` e `/mural#retirar` abrem direto
- [x] No celular (< 768 px), os dois formulários são passo a passo (`Wizard.tsx`): envio em 4 etapas (foto, sobre a foto, seus dados, autorizações) e remoção em 2 (qual foto, contato). No computador, formulário inteiro

### 4.8 Variáveis de ambiente

Ver `.env.example` (valores locais já batem com o `docker-compose.yml`). Novas: `S3_PUBLIC_BASE_URL` (URL de leitura do bucket público, também liberada no `next/image`).

### 4.9 Pendências da Etapa 4 para produção

- [x] Banco e buckets: criados sozinhos no deploy (migrações e buckets na inicialização do container)
- [x] Bucket público com leitura anônima só de objetos (listagem bloqueada), servido pelo domínio de fotos
- [x] Confirmado na homologação: o proxy do Coolify usa o IP real e ignora `X-Forwarded-For` falsificado (o limite de login bloqueou na 21ª tentativa com IPs forjados)
- [ ] Política de retenção: hoje o original privado de fotos rejeitadas/removidas é mantido

---

## 5. Etapa 5 — Painel administrativo

Objetivo: só administradores autenticados aprovam, rejeitam ou removem (spec §9.6).

> Concluída localmente em 14/10/2026. Teste ponta a ponta das APIs (30 verificações) e capturas de tela em 1440px e 390px.

- [x] Autenticação com **sessões no banco** (`AdminSession`), em vez do Auth.js: com login por e-mail e senha o Auth.js só oferece JWT, que não pode ser revogado. Senha com `scrypt` nativo do Node; cookie `HttpOnly`, `SameSite=Lax`, `Secure` + prefixo `__Host-` em produção; validade de 12 h; limite de 5 falhas por conta e 20 por IP a cada 15 min (só falhas contam). Código em `src/lib/auth/`.
- [x] Contas por script: `npm run admin -- criar|listar|nova-senha|desativar|reativar` (`scripts/admin.ts`)
- [x] `src/app/admin/login` e `src/app/admin/(painel)/mural` + `/retiradas` (fora do grupo `(site)`). A pedido do cliente (15/10/2026), há um botão **Entrar** no cabeçalho, à esquerda de "Agende sua aula experimental" (`Header.tsx`; só o cadeado entre 1024 e 1279 px, por espaço); a proteção é o login, não esconder o endereço
- [x] **Conteúdo pelo painel (só ADMIN):** `/admin/curriculos` troca os pôsteres dos currículos (PDF da GB vira imagem no navegador via pdf.js; versão e mês de referência) e `/admin/fotos` troca todas as fotos do site (espaços em `src/data/site-images.ts`). Arquivos no bucket público; tabelas `SiteImage` e `CurriculumPoster`; sem troca, vale a imagem padrão do código. Páginas do site passam a renderizar por requisição, com cache invalidado a cada troca (`src/lib/content/cache.ts`).
- [x] `src/middleware.ts` barra `/admin` e `/api/admin` sem cookie; cada página (`requireAdminPage`) e handler (`requireAdminApi`) valida sessão e papel no banco
- [x] `robots: { index: false }` no layout admin e `X-Robots-Tag: noindex` pelo middleware
- [x] APIs (spec §11):
  - [x] `GET /api/admin/mural` — filtros por status, categoria e período (datas em horário de Brasília), contagem por status, cursor
  - [x] `GET /api/admin/mural/:id` — detalhe privado, imagem por URL assinada de 5 min
  - [x] `PATCH /api/admin/mural/:id/approve` — exige revisão de direitos e autorização de responsáveis resolvida; gera derivado WebP; grava `approvedAt`, `moderatedBy`
  - [x] `PATCH /api/admin/mural/:id/awaiting-guardian` — segura foto com menores até a autorização
  - [x] `PATCH /api/admin/mural/:id/reject` — motivo obrigatório
  - [x] `DELETE /api/admin/mural/:id` — motivo obrigatório; apaga derivado público
  - [x] `GET /api/admin/mural/:id/audit` (histórico) e `POST` (observação interna)
  - [x] `GET /api/admin/removal-requests` e `PATCH /api/admin/removal-requests/:id` (resolver/descartar, opcionalmente removendo a foto)
  - [x] `POST /api/admin/login` e `POST /api/admin/logout` (logout revoga a sessão no banco)
- [x] Transições atômicas (`updateMany where { id, status }` em transação); concorrência devolve 409
- [x] Todo evento grava `MuralModerationEvent` com o admin
- [x] CSRF: toda mutação exige `Origin` do próprio site (403 caso contrário), além do `SameSite=Lax`
- [x] UI: abas por status com contagem, filtros, `StatusBadge`, `ConfirmDialog` (rejeitar/remover), `Toast`, observação interna, histórico
- [x] Fila de pedidos de retirada
- [x] `401` sem sessão, `403` sem papel ou origem inválida, `404` para ID que não é UUID
- [ ] Gerenciar contas pelo painel (hoje só por script; o papel `ADMIN` já existe para isso)
- [ ] Criar as contas reais da equipe (o cliente precisa informar quem modera)

---

## 6. Etapa 6 — Qualidade, deploy e homologação

- [ ] Testes de integração das APIs (banco de teste ou mocks do Prisma)
- [ ] Playwright E2E cobrindo os critérios da spec §15 (o projeto já usa Chromium localmente para conferir telas)
- [ ] Teste: foto `PENDING` nunca aparece em API pública, HTML, cache ou storage público
- [ ] Acessibilidade: rodar axe (`@axe-core/playwright`) nas páginas principais
- [ ] Lighthouse / Core Web Vitals (medir antes de afirmar resultados)
- [x] CI no GitHub Actions: `npm ci`, `lint`, `tsc --noEmit`, `test`, `build` (`.github/workflows/ci.yml`)
- [x] Imagem Docker de produção (`Dockerfile`, Next standalone, usuário sem root, healthcheck) e `docker-compose.coolify.yml`, testados localmente de ponta a ponta
- [x] Deploy de **homologação** no Coolify (15/10/2026): https://gb.besteweb.com.br (fotos em https://fotos-gb.besteweb.com.br), projeto "Site GB", aplicação `site-gb`, chave de deploy somente leitura no GitHub
- [ ] Criar as contas do painel na homologação (terminal do container `app`)
- [ ] Deploy automático a cada push (webhook do GitHub para o Coolify; hoje o deploy é manual)
- [ ] Produção no domínio definitivo da academia (trocar os domínios do recurso, com autorização do cliente)
- [ ] Monitoramento de erros (ex.: Sentry) sem vazar dados pessoais
- [ ] Backups do banco e das fotos configurados no Coolify, com restauração testada (orientação na seção 8 do guia de deploy)
- [x] README com deploy, migrações e variáveis

---

## 7. Pendências de conteúdo do cliente (spec §16)

Quando chegar cada item, o lugar de trocar já está indicado:

| Item | Onde entra no código |
|---|---|
| ✅ **Endereço e mapa** (26/10/2026): Rua Marechal Cardoso Júnior, 194 – Jardim das Américas, Curitiba–PR, 81530-420 | `src/config/site.ts` (`site.address`, `fullAddress`, `maps`). Contato: endereço, "Como chegar" (rota no Google Maps), "Ver no Google" (perfil enviado pelo cliente) e mapa incorporado sem chave de API. Também no `ContactCTA`, no rodapé e no /llms.txt |
| Redes sociais oficiais | ✅ Instagram `@gbjardimdasamericas` em `src/config/site.ts → site.social` (rodapé e Contato). Facebook/YouTube: só se o cliente tiver |
| Logo oficial (escudo) e manual de marca | ✅ Escudo recebido (originais em `assets/marca/`), usado no favicon e nos ícones (`src/app/icon.png`, `apple-icon.png`). No cabeçalho e rodapé o cliente preferiu manter o nome em texto (15/10/2026). O SVG enviado é um PNG embutido; um vetorial deixaria a marca mais nítida. Manual de marca pendente |
| **Fonte oficial da marca** | Manual exige **AdiHaus DIN** (única permitida). Faltam os arquivos web licenciados; **D-DIN** (mesma família, licença OFL) é a provisória desde 19/10/2026. Como instalar: `docs/IDENTIDADE-VISUAL.md` |
| **Logotipos oficiais em vetor** (Escudo, Linear, Verticalizada, identificação da escola) | Pedir a `suporte@graciebarra.com`; detalhes em `docs/IDENTIDADE-VISUAL.md` |
| Fotos da unidade, treinos e hero | `PhotoPlaceholder` em `page.tsx` e `Hero.tsx` (usar `next/image`) |
| ✅ **Retratos do Mural do Legado** (Maeda, Carlos Gracie Sr., Hélio, Rolls, Carlos Gracie Jr.) | Retratos oficiais de graciebarra.com/brasil/sobre-nos, sem edição (originais em `assets/marca/legado/`), em `/sobre#legado`. Uso liberado pelo cliente em 21/10/2026 como escola autorizada. **Guardar a autorização por escrito do franqueador** para a imagem de Carlos Gracie Sr. e Jr. (manual p. 19) |
| ✅ **Currículos de treino** (GB1, GB2, Sem Kimono, GB3 e GBK) | Seção em `/programas#curriculos` (`src/data/curriculums.ts`). **Só visualização, sem download** (pedido do cliente, 26/10/2026): o card abre um visualizador com a imagem do pôster (`src/assets/curriculos/*-completo.webp`, 1800 px, com "Ampliar"); o PDF não é publicado e o botão direito/arrastar a imagem ficam bloqueados (print de tela continua possível — nenhum site consegue impedir). PDFs otimizados guardados em `assets/curriculos/` (fora da pasta pública). Para atualizar uma versão: otimizar o novo PDF, renderizar a página com 1800 px de largura em WebP (qualidade 82) como `<slug>-completo.webp` e trocar também a miniatura de 480 px |
| ✅ **/llms.txt** (resumo em Markdown para IAs, padrão llmstxt.org) | Gerado de `src/lib/llms.ts` a partir dos mesmos dados das páginas (grade, turmas, contato, currículos, legado); se atualiza sozinho. Anunciado no `<head>` (`alternates.types`). Ao incluir endereço, professores ou novas páginas, acrescentar lá também |
| Professores (nome, foto, graduação, bio) | criar `src/data/teachers.ts` + `TeacherCard`; páginas Home e `professores/` |
| História e diferenciais da unidade | `sobre/page.tsx` e seção "Somos Gracie Barra..." da Home |
| ✅ Grade atualizada para a versão de 10/08/2026 (19/10/2026) | Próximas mudanças: `src/data/schedule.ts` e `tests/schedule.test.ts` juntos. A grade é exibida em linhas por faixa de horário (`scheduleSlots`), com espaço vazio onde não há aula (pedido do cliente) |
| ✅ Ressalva "Sujeito a alterações…" | Faz parte da grade oficial; exibida abaixo da grade com link para o Instagram |
| Política de imagens de menores, autorizações e retirada | textos do formulário em `PhotoUploadForm.tsx` e página Mural |
| Administradores da moderação | seed de `Admin` na Etapa 5 |
| Hospedagem, domínio, banco, storage, e-mail | Etapa 4 |
| Aprovação dos textos provisórios | Home, Sobre, Programas, benefícios (`src/data/benefits.ts`) |
| Depoimentos reais autorizados | seção ainda não criada; só criar com depoimentos reais |
| ✅ Dados estruturados (JSON-LD `SportsActivityLocation`) | `src/app/(site)/layout.tsx`: nome, telefone, e-mail, endereço, mapa e Instagram. Ao confirmar horário de funcionamento ou coordenadas, acrescentar lá |

---

## 8. Ajustes técnicos conhecidos

- [x] **Abas da grade em telas largas:** `ScheduleBoard.tsx` só aplica `role="tabpanel"` abaixo de `lg` (via `matchMedia`); em telas largas a semana é uma lista de seções.
- [x] **Hidratação do "dia atual":** Home e Horários calculam o dia no servidor com fuso `America/Sao_Paulo` (`defaultDay(date, academyTimeZone)`) e revalidam a cada hora; o navegador só corrige se o cache tiver virado o dia.
- [x] **Aviso de endereço repetido:** removido do `ContactCTA` com a chegada do endereço (26/10/2026).
- [ ] **`next/image`:** ainda não há imagens reais; ao adicionar, configurar `images.remotePatterns` para o domínio do storage.
- [ ] **Teste de navegador:** não há Playwright no `package.json` ainda (Etapa 6).
- [ ] **Branches antigas** `feat/etapa-1-fundacao-visual` e `feat/etapa-2-horarios` podem ser apagadas no GitHub; tudo já está na `main`.

---

## 9. Critérios de aceite (spec §15) — situação atual

### Institucional
- [x] Identifica a unidade Jardim das Américas
- [x] Funciona em celular, tablet e desktop (conferido em 390px e 1440px)
- [x] Navegação e CTAs acessíveis por teclado (menu mobile com Esc e foco)
- [x] Links externos com `target="_blank" rel="noopener noreferrer"`
- [x] Telefone e WhatsApp (41) 3205-8109 (`tel:+554132058109` e `wa.me/554132058109` com mensagem)
- [x] Endereço, professores e fotos oficiais não inventados

### Grade
- [x] 27 blocos conferem com o PDF de 10/08/2026 (teste automático), incluindo faixas etárias do GBK
- [x] Siglas, horários, notas e legenda corretos
- [x] Sem sábado/domingo
- [x] Filtros não separam GB1 + GB2

### Mural
- [x] Visitante envia foto sem login
- [x] Arquivo inválido rejeitado **pelo servidor**
- [x] Envio válido entra como `PENDING`, sem URL pública
- [x] Foto pendente não aparece em API, HTML ou storage público (conferido localmente; falta teste automatizado na Etapa 6)
- [x] Só admin autenticado modera
- [x] Aprovação exige autorizações (`approvePost`)
- [x] Foto aprovada aparece no filtro certo
- [x] Rejeição não publica
- [x] Remoção retira da galeria e apaga o derivado público
- [x] Contatos fora de payloads públicos
- [x] Ações administrativas auditadas (com o admin autenticado)
- [x] Existe canal de pedido de retirada (formulário + WhatsApp)

### Operação
- [x] Segredos apenas em variáveis de ambiente (nenhum segredo no repositório)
- [ ] Backups e restauração definidos
- [ ] Erros tratados sem vazamento (APIs ainda não existem)
- [x] Testes automatizados (unitários) e verificação manual de responsividade
- [ ] Conteúdo e ativos aprovados antes do lançamento

---

## 10. Convenções

- Conventional Commits em português: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `test:`, `chore:`.
- Antes de subir: `npm run lint && npx tsc --noEmit && npm test && npm run build`.
- Classes de cor sempre pelos tokens `gb-*` (nunca hex solto nos componentes).
- Conteúdo provisório sempre com `PlaceholderNotice` ou `PlaceholderBadge`.
- Links do WhatsApp sempre via `whatsappUrl(mensagem)` de `src/config/site.ts`.
- Dados (grade, turmas, links) ficam em `src/data`, nunca dentro dos componentes.
