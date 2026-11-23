#!/bin/sh
# Gera a configuração do S3 a partir do ambiente e sobe o SeaweedFS.
# - credencial do app: acesso total
# - anônimo: só leitura do bucket público (fotos aprovadas)
set -e

: "${S3_ACCESS_KEY_ID:?defina S3_ACCESS_KEY_ID}"
: "${S3_SECRET_ACCESS_KEY:?defina S3_SECRET_ACCESS_KEY}"
: "${S3_BUCKET_PUBLIC:?defina S3_BUCKET_PUBLIC}"

mkdir -p /etc/seaweedfs
cat > /etc/seaweedfs/s3.json <<EOF
{
  "identities": [
    {
      "name": "app",
      "credentials": [{ "accessKey": "${S3_ACCESS_KEY_ID}", "secretKey": "${S3_SECRET_ACCESS_KEY}" }],
      "actions": ["Admin", "Read", "Write", "List", "Tagging"]
    },
    { "name": "anonymous", "actions": ["Read:${S3_BUCKET_PUBLIC}"] }
  ]
}
EOF

# Volumes de 1 GB (o padrão é 30 GB): com o padrão, cada bucket reserva vários
# volumes e o segundo bucket fica sem espaço ("No writable volumes").
exec weed server -dir=/data -master.volumeSizeLimitMB=1024 -volume.max=100 \
  -s3 -s3.port=8333 -s3.config=/etc/seaweedfs/s3.json
