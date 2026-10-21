# Imagem de produção do site (deploy no Coolify via docker-compose.coolify.yml).

FROM node:22-bookworm-slim AS deps
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
# O postinstall roda `prisma generate`.
RUN npm ci --no-audit --no-fund

FROM deps AS builder
COPY . .
# Entra no HTML gerado no build (SEO, Open Graph).
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build
# Scripts de operação empacotados em JS puro (o container não tem tsx nem o código-fonte).
RUN node scripts/build-scripts.mjs

# CLI do Prisma só para aplicar migrações na inicialização.
FROM node:22-bookworm-slim AS migrator
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app/migrate
RUN npm init -y > /dev/null \
 && npm install --no-audit --no-fund prisma@7.10.0 dotenv@18.0.8
COPY prisma ./prisma
COPY prisma.config.ts ./

FROM node:22-bookworm-slim AS runner
# OpenSSL: exigido pelo motor de migrações do Prisma.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
# Arquivos públicos servidos como estão (ex.: PDFs dos currículos).
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/dist-scripts ./scripts
COPY --from=migrator --chown=node:node /app/migrate ./migrate
COPY --chown=node:node docker/start-app.sh ./start.sh
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["sh", "./start.sh"]
