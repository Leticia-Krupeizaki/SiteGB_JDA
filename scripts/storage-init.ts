/**
 * Garante que os buckets existam. Localmente: npm run storage:init.
 * No container, roda a cada início (docker/start-app.sh), esperando o storage subir.
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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureBucket(bucket: string) {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`ok     ${bucket} (já existe)`);
  } catch (error) {
    // 404: não existe. Qualquer outro erro (storage ainda subindo, credencial errada) sobe para o retry.
    if ((error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode !== 404) throw error;
    await s3.send(new CreateBucketCommand({ Bucket: bucket }));
    console.log(`criado ${bucket}`);
  }
}

async function main() {
  const buckets = [process.env.S3_BUCKET_PRIVATE!, process.env.S3_BUCKET_PUBLIC!];
  for (let attempt = 1; ; attempt++) {
    try {
      for (const bucket of buckets) await ensureBucket(bucket);
      return;
    } catch (error) {
      if (attempt >= 30) throw error;
      console.log(`storage indisponível (tentativa ${attempt}/30), aguardando…`);
      await sleep(2000);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? `${error.name}: ${error.message}` : error);
  process.exitCode = 1;
});
