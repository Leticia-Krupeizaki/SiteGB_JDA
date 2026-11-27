# Publicação no GitHub Pages

Desde 23/11/2026 o site é publicado pelo **GitHub Pages**, no lugar do Coolify. A cada push na `main`, o workflow [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) roda os testes, gera o site (`npm run build` → `out/`) e publica. O andamento fica na aba **Actions** do repositório.

| | |
|---|---|
| Repositório | `Leticia-Krupeizaki/SiteGB_JDA` (público) |
| Domínio | `gbjardimdasamericas.com.br` desde 27/11/2026 (antes `gb.besteweb.com.br`); definido em `SITE_URL`, no workflow |

## Configuração (uma vez só)

1. **Tornar o repositório público:** Settings → General → Danger Zone → Change visibility → Public. (O histórico foi limpo em 23/11/2026: os PDFs dos currículos, que o cliente pediu para não disponibilizar, foram removidos de todos os commits e ficam só na máquina local.)
2. **Ligar o Pages:** Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. **Publicar a primeira vez:** aba Actions → "Publicar no GitHub Pages" → Run workflow (ou faça um push na `main`).
4. **Domínio:** Settings → Pages → Custom domain: `gb.besteweb.com.br` → Save.
5. **DNS** (no painel de DNS do besteweb.com.br): criar o registro `CNAME` `gb` → `leticia-krupeizaki.github.io`. Ele tem prioridade sobre o curinga `*.besteweb.com.br`, que aponta para o servidor do Coolify.
6. Quando o GitHub mostrar o domínio como verificado e o certificado pronto (pode levar até 1 hora), marque **Enforce HTTPS**.

## Trocar o domínio

Altere `SITE_URL` no workflow e o Custom domain em Settings → Pages, ajuste o DNS e faça push.

## Diferenças em relação ao nginx do Coolify

- `/professores` funciona; `/professores/` (com barra no fim) dá 404 em vez de redirecionar.
- Cabeçalhos de cache e de segurança são os padrões do GitHub Pages (o `nginx.conf` deixa de valer).
- O `Dockerfile`, o `nginx.conf` e o `docker-compose.coolify.yml` continuam no repositório só para voltar ao Coolify, se preciso. O recurso antigo foi excluído em 23/11/2026 (ver [DEPLOY-COOLIFY.md](DEPLOY-COOLIFY.md)).
