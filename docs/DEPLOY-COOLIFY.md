# Deploy no Coolify

O site sobe como **um recurso Docker Compose** no Coolify, com três serviços definidos em [`docker-compose.coolify.yml`](../docker-compose.coolify.yml):

| Serviço | O que é | Exposto na internet |
|---|---|---|
| `app` | Site Next.js + APIs + painel `/admin` (imagem do [`Dockerfile`](../Dockerfile)) | Sim, domínio principal |
| `db` | PostgreSQL 17 | Não (só rede interna) |
| `storage` | SeaweedFS, compatível com S3 ([`docker/seaweedfs`](../docker/seaweedfs)) | Sim, domínio das fotos |

Senhas, usuários e o segredo de sessão são **gerados pelo Coolify** (variáveis `SERVICE_*`) e ficam salvos entre deploys. Nenhum segredo fica no repositório.

A cada início, o container `app`:

1. aplica as migrações pendentes do banco (`prisma migrate deploy`);
2. cria os buckets do storage se não existirem;
3. sobe o site.

O mesmo compose foi testado localmente de ponta a ponta antes de subir: build, migrações, envio de foto, moderação, publicação, remoção e permissões.

---

## Situação atual

**Homologação no ar** desde 15/10/2026 no Coolify da Beste Web (`coolify.besteweb.com.br`):

| | |
|---|---|
| Projeto / ambiente | `Site GB` / `production` |
| Aplicação | `site-gb` (Docker Compose, branch `main`) |
| Site | https://gb.besteweb.com.br |
| Fotos | https://fotos-gb.besteweb.com.br |
| Acesso ao repositório | chave de deploy `site-gb-deploy` (somente leitura, cadastrada no GitHub como "Coolify besteweb") |

O servidor tem domínio curinga `*.besteweb.com.br`, por isso a homologação não precisou de DNS novo. Para ir ao domínio definitivo, troque os domínios dos serviços `app` e `storage` no recurso e faça novo deploy.

O servidor hospeda outros projetos: altere apenas o projeto "Site GB".

## 1. Antes de começar

- Dois domínios (ou subdomínios) apontando (registro DNS `A`) para o IP do servidor do Coolify, por exemplo:
  - `gbjardimdasamericas.com.br` → site
  - `fotos.gbjardimdasamericas.com.br` → fotos do mural
- O Coolify com acesso ao repositório privado `Leticia-Krupeizaki/SiteGB_JDA` (GitHub App configurado em **Sources**).

## 2. Criar o recurso

1. **Projects** → escolha o projeto/ambiente → **+ New** → **Private Repository (with GitHub App)**.
2. Selecione o repositório `SiteGB_JDA`, branch `main`.
3. **Build Pack:** `Docker Compose`.
4. **Docker Compose Location:** `/docker-compose.coolify.yml`.
5. Clique em **Continue**. O Coolify lê o compose e mostra os serviços `app`, `db` e `storage`.

## 3. Domínios

Na tela do recurso, em **Domains**:

- **app:** `https://gbjardimdasamericas.com.br:3000`
- **storage:** `https://fotos.gbjardimdasamericas.com.br:8333`

O sufixo `:3000` / `:8333` indica ao Coolify a **porta interna** do container; o público acessa pelas portas normais (443). O Coolify emite os certificados HTTPS sozinho.

> As variáveis `SERVICE_URL_APP` e `SERVICE_URL_STORAGE` vêm desses domínios. O app usa a primeira como URL oficial do site (SEO) e a segunda para montar os links das fotos.

## 4. Variáveis de ambiente

Em **Environment Variables**, confira se o Coolify gerou:

| Variável | Uso |
|---|---|
| `SERVICE_USER_POSTGRES`, `SERVICE_PASSWORD_POSTGRES` | Usuário e senha do banco |
| `SERVICE_USER_S3`, `SERVICE_PASSWORD_64_S3` | Credencial do app no storage |
| `SERVICE_PASSWORD_64_AUTHSECRET` | Segredo do servidor (hash de IP no limite de envios) |

Não é preciso preencher nada à mão. **Não troque essas senhas depois do primeiro deploy** sem saber o que está fazendo: o banco e o storage guardam a credencial definida na primeira subida.

## 5. Deploy

Clique em **Deploy**. O primeiro build leva alguns minutos. Quando terminar, o serviço `app` deve aparecer como **healthy** (o healthcheck consulta `/api/health`, que testa o acesso ao banco).

Para deploy automático a cada push na `main`, ative **Auto Deploy** nas configurações do recurso.

## 6. Criar as contas do painel

Em **Terminal**, escolha o container `app` e rode:

```sh
node scripts/admin.mjs criar pessoa@exemplo.com ADMIN Nome da Pessoa
```

A senha é gerada e mostrada **uma única vez**. Entregue-a por canal seguro. Outros comandos:

```sh
node scripts/admin.mjs listar
node scripts/admin.mjs criar moderador@exemplo.com MODERATOR Nome
node scripts/admin.mjs nova-senha pessoa@exemplo.com   # encerra as sessões abertas
node scripts/admin.mjs desativar pessoa@exemplo.com    # encerra as sessões abertas
```

O painel fica em `https://SEU-DOMINIO/admin` (não há link no site público).

## 7. Conferir depois do deploy

- [ ] `https://SEU-DOMINIO` abre, e `https://SEU-DOMINIO/api/health` responde `{"ok":true}`
- [ ] Enviar uma foto em `/mural` → mensagem de recebida
- [ ] Entrar em `/admin`, aprovar a foto → ela aparece em `/mural`, servida pelo domínio de fotos
- [ ] Remover a foto pelo painel → some do mural
- [ ] `https://fotos.SEU-DOMINIO/sitegb-private/` responde **403** (bucket privado fechado)

## 8. Backups (configurar antes de abrir ao público)

Os dados ficam em dois volumes Docker do recurso: `db-data` (banco) e `storage-data` (fotos).

- **Banco:** verifique se o Coolify oferece **Backups** para o serviço `db` deste recurso (aba do serviço). Se oferecer, agende um backup diário com destino S3 externo. Se não, crie uma **Scheduled Task** no container `db` com `pg_dump` e copie o arquivo para fora do servidor.
- **Fotos:** inclua o volume `storage-data` no backup do servidor (snapshot do VPS ou cópia periódica).
- Teste a restauração pelo menos uma vez e anote o procedimento neste documento.

## Notas técnicas

- **IP real dos visitantes:** o limite de envios usa `X-Forwarded-For`, preenchido pelo proxy do Coolify (Traefik/Caddy). Não exponha a porta 3000 diretamente.
- **Cookies do painel:** em produção usam o prefixo `__Host-` e `Secure`, então o painel só funciona por HTTPS (o padrão no Coolify).
- **Storage:** só a porta S3 (8333) é roteada pelo proxy. As portas internas do SeaweedFS (master, volume, filer) ficam apenas na rede interna do recurso.
- **Volumes de 1 GB no SeaweedFS:** definidos em `docker/seaweedfs/start.sh`. Com o padrão de 30 GB, o segundo bucket ficava sem volume livre e a aprovação de fotos falhava.
- **Rollback:** o Coolify permite voltar para um deploy anterior, mas as migrações de banco só andam para frente. Antes de uma migração destrutiva, faça backup.
