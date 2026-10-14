# Próximos passos — Site Gracie Barra Jardim das Américas

> Estado em 14/10/2026, commit `9c337c6` na `main`.
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
| 4 | Backend do mural (banco, storage, upload seguro, APIs) | ⬜ A fazer |
| 5 | Painel administrativo de moderação | ⬜ A fazer |
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
- Fontes: Barlow Condensed (títulos) e Barlow (texto) via `next/font/google`

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
    schedule.ts             # GRADE OFICIAL (22 blocos) + cores auxiliares por turma
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

- **Cores do cliente:** `#D71921` (vermelho), `#002F80` (azul), `#FFFFFF`, `#111111`, `#E5E7EB`. Tons `-dark` e `gb-mute` são derivados para hover e texto secundário.
- **Visual inspirado no site da Gracie Barra Brasil**, sem copiar textos, imagens ou código. A **faixa com graus** (`Belt.tsx`) separa as seções.
- **Cores auxiliares por turma** (Contexto.md): GBK verde, GB1 azul, GB2 roxo, GBF rosa, No-Gi cinza.
- **WhatsApp confirmado** pela spec v1.0: `554132058109`. Mensagens sempre com `encodeURIComponent` (use `whatsappUrl()`).
- **Trabalho direto na `main`**, Conventional Commits em português.
- **Nada de dados inventados:** endereço, professores, fotos, história e depoimentos aparecem como "A confirmar" (`PlaceholderNotice`) até o cliente enviar.

---

## 4. Etapa 4 — Backend do mural (Fase B)

Objetivo: o envio público passa a ser real, mas **nenhuma foto fica pública sem aprovação** (spec §9, §10, §11, §12).

### 4.1 Decisões que precisam vir antes (cliente)

- [ ] Hospedagem (sugestão: Vercel)
- [ ] Banco PostgreSQL (sugestão: Neon ou Supabase)
- [ ] Storage S3 compatível com bucket privado (sugestão: Cloudflare R2 ou AWS S3)
- [ ] Domínio final (para `NEXT_PUBLIC_SITE_URL`)
- [ ] Texto final da política de privacidade e do termo de autorização de imagem (versões em `src/data/mural.ts → muralPolicyVersions`)
- [ ] Política de retenção e exclusão de fotos rejeitadas/removidas

### 4.2 Dependências sugeridas

```bash
npm i prisma @prisma/client sharp file-type @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Use **um ORM só** (Prisma está previsto no README). `sharp` reprocessa a imagem e remove EXIF; `file-type` checa magic bytes.

### 4.3 Banco de dados (Prisma)

- [ ] `prisma/schema.prisma` com:
  - `Admin` (id UUID, email único, passwordHash ou providerId, role, createdAt, updatedAt)
  - `MuralPost` (campos da spec §10: studentName, contactType, contactValue, caption, category, status, originalObjectKey, publicObjectKey, privacyPolicyVersion, privacyAcceptedAt, publicationConsentVersion, publicationConsentAt, guardianAuthorizationStatus, thirdPartyRightsReviewed, approvedAt, moderatedBy, rejectionReason, createdAt, updatedAt, removedAt, além de `showNamePublicly` e `showCaptionPublicly` se o cliente quiser controlar a exibição)
  - `MuralModerationEvent` (postId, adminId, action, previousStatus, nextStatus, reason, createdAt)
  - `MuralRemovalRequest` (postId?, requesterContact, reason, status, createdAt, resolvedAt, resolutionNote)
  - Enums: `MuralStatus`, `MuralCategory`, `ContactType` — **alinhar com `src/types/mural.ts`**
  - Índices `(status, createdAt)` e `(category, status, createdAt)`
- [ ] `src/lib/db/client.ts` com singleton do Prisma
- [ ] Migração inicial versionada (`npx prisma migrate dev --name init`)

### 4.4 Armazenamento de imagens

- [ ] `src/lib/storage/` com funções `putPrivateObject`, `getSignedUrl` (URL temporária), `copyToPublic`/`putPublicDerivative`, `deleteObject`
- [ ] Bucket **privado** para originais e pendentes; derivado público só gerado **após aprovação**
- [ ] Nomes de objeto por UUID, nunca o nome original do arquivo
- [ ] Credenciais só em variáveis de ambiente, nunca expostas ao navegador

### 4.5 Upload seguro (`POST /api/mural`)

- [ ] `src/app/api/mural/route.ts` recebendo `multipart/form-data`
- [ ] Reaproveitar `muralSubmissionSchema` de `src/lib/validation/mural.ts`
- [ ] Limite de tamanho de request e de arquivo (10 MB, `muralLimits.maxFileBytes`)
- [ ] Checar magic bytes (JPG/PNG/WebP) com `file-type`, não confiar no `type` do navegador
- [ ] Decodificar e reprocessar com `sharp` (`.rotate()` + reencode), removendo EXIF/GPS; rejeitar arquivos corrompidos
- [ ] Limite de dimensão máxima processável
- [ ] Honeypot (`website` vazio) já existe no schema; descartar silenciosamente se vier preenchido
- [ ] Rate limiting: 5 envios/hora por origem como ponto de partida (`src/lib/rate-limit/`; em serverless usar Upstash Redis ou tabela no banco)
- [ ] Gravar `PENDING`, versões e datas dos aceites
- [ ] Responder `201 { id, status: 'PENDING' }`, **sem URL pública**
- [ ] Erros padronizados `{ code, message, fieldErrors? }`; `400/422` validação, `429` rate limit
- [ ] Logs sem conteúdo de arquivo, contatos ou credenciais

### 4.6 APIs públicas restantes

- [ ] `GET /api/mural?category=&cursor=&limit=12` — só `APPROVED`, só campos publicáveis (`PublicMuralPost`), paginação por cursor
- [ ] `GET /api/mural/categories`
- [ ] `POST /api/mural/removal-requests` — pedido de retirada (hoje é via WhatsApp)

### 4.7 Trocar a demonstração pelo real no front

- [ ] `PhotoUploadForm.tsx`: enviar `FormData` para `POST /api/mural`; mostrar erros do servidor por campo; estado de envio (loading) e erro de rede; mensagem final "Recebemos sua foto! Ela será analisada pela equipe antes de aparecer no mural."
- [ ] `MuralGallery.tsx`: buscar `GET /api/mural` (ou Server Component) em vez de `demoMuralPosts`; "Carregar mais" com cursor; usar `next/image` com `width/height` ou `aspectRatio` para evitar CLS
- [ ] Mostrar nome/legenda só quando houver consentimento
- [ ] Remover `DemoNotice`, `DemoPhotoTile` e `demoMuralPosts` quando houver fotos reais
- [ ] Atualizar o teste "dados de demonstração" em `tests/mural.test.ts`
- [ ] Prévia da Home (seção Mural) passa a mostrar as últimas fotos aprovadas

### 4.8 Variáveis de ambiente (`.env.example` já tem o esqueleto)

```text
DATABASE_URL=
S3_ENDPOINT=
S3_REGION=
S3_BUCKET_PRIVATE=
S3_BUCKET_PUBLIC=        # ou prefixo público no mesmo bucket
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
AUTH_SECRET=
NEXT_PUBLIC_SITE_URL=
RATE_LIMIT_REDIS_URL=    # se usar Upstash
```

---

## 5. Etapa 5 — Painel administrativo

Objetivo: só administradores autenticados aprovam, rejeitam ou removem (spec §9.6).

- [ ] Autenticação com biblioteca consolidada (sugestão: Auth.js / NextAuth v5) — cookies `HttpOnly`, `Secure`, `SameSite`; sessões revogáveis; limite de tentativas de login
- [ ] `src/app/admin/login/page.tsx` e `src/app/admin/mural/page.tsx` (fora do grupo `(site)`, sem link no menu público)
- [ ] `middleware.ts` protegendo `/admin` e `/api/admin`, **e** checagem de papel dentro de cada handler (não confiar só na UI)
- [ ] `metadata.robots = { index: false }` nas páginas admin (o `robots.ts` já bloqueia `/admin`)
- [ ] APIs (spec §11):
  - [ ] `GET /api/admin/mural` — todos os status, filtros por categoria, período e status
  - [ ] `GET /api/admin/mural/:id` — detalhe privado, imagem por **URL assinada temporária**
  - [ ] `PATCH /api/admin/mural/:id/approve` — exige autorizações; bloqueia se `AWAITING_GUARDIAN_AUTHORIZATION`; gera derivado WebP/AVIF; grava `approvedAt`, `moderatedBy`
  - [ ] `PATCH /api/admin/mural/:id/reject` — motivo obrigatório
  - [ ] `DELETE /api/admin/mural/:id` — remove do mural, apaga derivado público, inicia política de exclusão
  - [ ] `GET /api/admin/mural/:id/audit` — histórico
- [ ] Transições de status **atômicas** (transação com `where: { id, status: atual }`) para evitar aprovações concorrentes
- [ ] Todo evento grava `MuralModerationEvent`
- [ ] Proteção CSRF nas mutações (Auth.js cobre parte; conferir)
- [ ] UI: abas Pendentes / Aguardando autorização / Aprovadas / Rejeitadas / Removidas; `StatusBadge`; `ConfirmDialog` para remover; `Toast` de sucesso e erro; observação interna
- [ ] Fila de pedidos de retirada (`MuralRemovalRequest`)
- [ ] `401` para não autenticado, `403` para sem permissão; IDs não enumeráveis em rotas públicas

---

## 6. Etapa 6 — Qualidade, deploy e homologação

- [ ] Testes de integração das APIs (banco de teste ou mocks do Prisma)
- [ ] Playwright E2E cobrindo os critérios da spec §15 (o projeto já usa Chromium localmente para conferir telas)
- [ ] Teste: foto `PENDING` nunca aparece em API pública, HTML, cache ou storage público
- [ ] Acessibilidade: rodar axe (`@axe-core/playwright`) nas páginas principais
- [ ] Lighthouse / Core Web Vitals (medir antes de afirmar resultados)
- [x] CI no GitHub Actions: `npm ci`, `lint`, `tsc --noEmit`, `test`, `build` (`.github/workflows/ci.yml`)
- [ ] Deploy de homologação e depois produção (com autorização do cliente)
- [ ] Monitoramento de erros (ex.: Sentry) sem vazar dados pessoais
- [ ] Backups do banco e procedimento de restauração documentado
- [ ] README final com deploy, migrações e variáveis

---

## 7. Pendências de conteúdo do cliente (spec §16)

Quando chegar cada item, o lugar de trocar já está indicado:

| Item | Onde entra no código |
|---|---|
| Endereço completo e link do Google Maps | `src/config/site.ts → site.address`; seção "Onde estamos" em `ContactCTA.tsx` e `contato/page.tsx` |
| Redes sociais oficiais | `src/config/site.ts → site.social`; Footer e Contato |
| Logo oficial (escudo) e manual de marca | `src/components/layout/Logo.tsx` (hoje é marca tipográfica) |
| **Fonte oficial da marca** | `src/app/layout.tsx` (o logo usa Handel Gothic, que é paga; site usa Barlow até confirmar) |
| Fotos da unidade, treinos e hero | `PhotoPlaceholder` em `page.tsx` e `Hero.tsx` (usar `next/image`) |
| Professores (nome, foto, graduação, bio) | criar `src/data/teachers.ts` + `TeacherCard`; páginas Home e `professores/` |
| História e diferenciais da unidade | `sobre/page.tsx` e seção "Somos Gracie Barra..." da Home |
| Confirmar se a grade de 26/02/2026 segue atual | `src/data/schedule.ts` (os testes em `tests/schedule.test.ts` precisam ser atualizados junto) |
| Ressalva "Horários sujeitos a alterações" | só exibir se aprovada (página Horários) |
| Política de imagens de menores, autorizações e retirada | textos do formulário em `PhotoUploadForm.tsx` e página Mural |
| Administradores da moderação | seed de `Admin` na Etapa 5 |
| Hospedagem, domínio, banco, storage, e-mail | Etapa 4 |
| Aprovação dos textos provisórios | Home, Sobre, Programas, benefícios (`src/data/benefits.ts`) |
| Depoimentos reais autorizados | seção ainda não criada; só criar com depoimentos reais |
| Dados estruturados `LocalBusiness` | adicionar JSON-LD no `layout.tsx` **somente** com endereço confirmado |

---

## 8. Ajustes técnicos conhecidos

- [x] **Abas da grade em telas largas:** `ScheduleBoard.tsx` só aplica `role="tabpanel"` abaixo de `lg` (via `matchMedia`); em telas largas a semana é uma lista de seções.
- [x] **Hidratação do "dia atual":** Home e Horários calculam o dia no servidor com fuso `America/Sao_Paulo` (`defaultDay(date, academyTimeZone)`) e revalidam a cada hora; o navegador só corrige se o cache tiver virado o dia.
- [ ] **Aviso de endereço repetido:** `ContactCTA` mostra "A confirmar · endereço completo e mapa" em todas as páginas; remover quando o endereço chegar.
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
- [x] Número visível (41) 3205-8109, `tel:+554132058109` e `wa.me/554132058109` com mensagem
- [x] Endereço, professores e fotos oficiais não inventados

### Grade
- [x] 22 blocos conferem com o PDF (teste automático)
- [x] Siglas, horários, notas e legenda corretos
- [x] Sem sábado/domingo
- [x] Filtros não separam GB1 + GB2

### Mural
- [ ] Visitante envia foto sem login (hoje só demonstração)
- [ ] Arquivo inválido rejeitado **pelo servidor**
- [ ] Envio válido entra como `PENDING`, sem URL pública
- [ ] Foto pendente não aparece em API, HTML, cache ou storage público
- [ ] Só admin autenticado modera
- [ ] Aprovação exige autorizações
- [ ] Foto aprovada aparece no filtro certo
- [ ] Rejeição não publica
- [ ] Remoção retira da galeria e do acesso público
- [ ] Contatos fora de payloads públicos
- [ ] Ações administrativas auditadas
- [x] Existe canal de pedido de retirada (WhatsApp, provisório)

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
