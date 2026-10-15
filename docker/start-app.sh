#!/bin/sh
# Início do container: aplica migrações pendentes, garante os buckets e sobe o Next.
set -e

echo "[start] aplicando migrações do banco"
(cd /app/migrate && node node_modules/prisma/build/index.js migrate deploy)

echo "[start] conferindo buckets do storage"
node /app/scripts/storage-init.mjs

echo "[start] iniciando o site"
exec node /app/server.js
