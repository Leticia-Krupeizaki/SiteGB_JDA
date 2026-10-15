/**
 * Cria os buckets do storage LOCAL (docker compose). Em produção os buckets
 * são criados no provedor, com o público configurado para leitura anônima.
 * Uso: npm run storage:init
 */
import { CreateBucketCommand, HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  forcePathStyle: true,
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

async function main() {
  for (const bucket of [process.env.S3_BUCKET_PRIVATE!, process.env.S3_BUCKET_PUBLIC!]) {
    try {
      await s3.send(new HeadBucketCommand({ Bucket: bucket }));
      console.log(`ok     ${bucket} (já existe)`);
    } catch {
      await s3.send(new CreateBucketCommand({ Bucket: bucket }));
      console.log(`criado ${bucket}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
