# Deploy no Coolify

O site é **estático** e sobe como **um recurso Docker Compose** no Coolify, com um único serviço definido em [`docker-compose.coolify.yml`](../docker-compose.coolify.yml):

| Serviço | O que é | Exposto na internet |
|---|---|---|
| `app` | nginx servindo os arquivos gerados por `npm run build` (imagem do [`Dockerfile`](../Dockerfile), configuração em [`nginx.conf`](../nginx.conf)) | Sim, domínio principal (porta interna 3000) |

O `Dockerfile` tem duas etapas: o Node gera o site (`out/`) e a imagem final leva só o nginx com esses arquivos. Não há banco, armazenamento, segredos nem variáveis a preencher além do domínio.

---

## Situação atual

**Homologação no ar** desde 15/10/2026 no Coolify da Beste Web (`coolify.besteweb.com.br`):

| | |
|---|---|
| Projeto / ambiente | `Site GB` / `production` |
| Aplicação | `site-gb` (Docker Compose, branch `main`) |
| Site | https://gb.besteweb.com.br |
| Acesso ao repositório | chave de deploy `site-gb-deploy` (somente leitura, cadastrada no GitHub como "Coolify besteweb") |

O servidor tem domínio curinga `*.besteweb.com.br`, por isso a homologação não precisou de DNS novo. Para ir ao domínio definitivo, troque o domínio do serviço `app` no recurso e faça novo deploy.

O servidor hospeda outros projetos: altere apenas o projeto "Site GB".

### Migração para o site estático (23/11/2026)

Até 23/11/2026 o recurso tinha também os serviços `db` (PostgreSQL) e `storage` (SeaweedFS, domínio `fotos-gb.besteweb.com.br`), usados pelo painel `/admin` e pelo envio de fotos do mural. Com o site estático eles saíram do compose. Os volumes `db-data` e `storage-data` continuam no servidor até serem apagados à mão no Coolify; antes de apagar, decida se é preciso guardar uma cópia (o banco tem os dados de contato de quem enviou fotos e pedidos de retirada).

## 1. Antes de começar

- Um domínio (ou subdomínio) apontando (registro DNS `A`) para o IP do servidor do Coolify, por exemplo `gbjardimdasamericas.com.br`.
- O Coolify com acesso ao repositório privado `Leticia-Krupeizaki/SiteGB_JDA`.

## 2. Criar o recurso

1. **Projects** → escolha o projeto/ambiente → **+ New** → **Private Repository (with GitHub App)**.
2. Selecione o repositório `SiteGB_JDA`, branch `main`.
3. **Build Pack:** `Docker Compose`.
4. **Docker Compose Location:** `/docker-compose.coolify.yml`.
5. Clique em **Continue**. O Coolify lê o compose e mostra o serviço `app`.

## 3. Domínio

Na tela do recurso, em **Domains**, preencha o serviço **app** com `https://gbjardimdasamericas.com.br:3000`.

O sufixo `:3000` indica ao Coolify a **porta interna** do container; o público acessa pela porta normal (443). O Coolify emite o certificado HTTPS sozinho. A variável `SERVICE_URL_APP` vem desse domínio e entra no build como URL oficial do site (SEO, Open Graph, sitemap); por isso, **ao trocar o domínio, faça novo deploy**.

## 4. Deploy

Clique em **Deploy**. O build leva alguns minutos. Quando terminar, o serviço `app` deve aparecer como **healthy** (o healthcheck abre a página inicial).

Para deploy automático a cada push na `main`, ative **Auto Deploy** nas configurações do recurso. Sem isso, cada atualização de conteúdo precisa de um clique em **Deploy**.

## 5. Conferir depois do deploy

- [ ] `https://SEU-DOMINIO` abre, e as páginas `/sobre`, `/programas`, `/professores`, `/horarios`, `/mural` e `/contato` também
- [ ] Um endereço inexistente mostra a página de erro (status 404)
- [ ] `https://SEU-DOMINIO/sitemap.xml`, `/robots.txt` e `/llms.txt` respondem
- [ ] As fotos do mural aparecem e ampliam ao clicar

## Notas técnicas

- **Endereços:** o nginx serve `/professores` a partir de `professores.html` e redireciona `/professores/` para `/professores` (ver `nginx.conf`).
- **Cache:** arquivos de `/_next/static/` têm hash no nome e ficam em cache por 1 ano; imagens por 1 dia; as páginas HTML são sempre revalidadas.
- **Rollback:** o Coolify permite voltar para um deploy anterior; como não há banco, não há migração a desfazer.
