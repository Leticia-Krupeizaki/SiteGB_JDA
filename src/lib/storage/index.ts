import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl as presign } from '@aws-sdk/s3-request-presigner';

/**
 * Storage compatível com S3. Dois buckets:
 * - privado: originais reprocessados e fotos pendentes, lidos só por URL assinada;
 * - público: derivados gerados apenas depois da aprovação.
 * Credenciais ficam no servidor; nada aqui pode ser importado por componente de cliente.
 */
export type BucketKind = 'private' | 'public';

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} não configurada.`);
  return value;
}

function createClient(endpoint: string): S3Client {
  return new S3Client({
    endpoint,
    region: env('S3_REGION'),
    forcePathStyle: true,
    credentials: { accessKeyId: env('S3_ACCESS_KEY_ID'), secretAccessKey: env('S3_SECRET_ACCESS_KEY') },
    // R2 e servidores S3 auto-hospedados não aceitam todos os checksums novos do SDK.
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });
}

let client: S3Client | undefined;
let signingClient: S3Client | undefined;

function s3(): S3Client {
  client ??= createClient(env('S3_ENDPOINT'));
  return client;
}

/**
 * URLs assinadas são abertas pelo navegador, então precisam do endereço público
 * do storage. No Docker, o app fala com o storage pela rede interna (S3_ENDPOINT)
 * e assina com o domínio público (S3_SIGNING_ENDPOINT).
 */
function s3ForSigning(): S3Client {
  signingClient ??= process.env.S3_SIGNING_ENDPOINT ? createClient(process.env.S3_SIGNING_ENDPOINT) : s3();
  return signingClient;
}

export function bucketName(kind: BucketKind): string {
  return env(kind === 'private' ? 'S3_BUCKET_PRIVATE' : 'S3_BUCKET_PUBLIC');
}

export async function putObject(kind: BucketKind, key: string, body: Uint8Array, contentType: string): Promise<void> {
  await s3().send(
    new PutObjectCommand({
      Bucket: bucketName(kind),
      Key: key,
      Body: body,
      ContentType: contentType,
      ...(kind === 'public' && { CacheControl: 'public, max-age=31536000, immutable' }),
    }),
  );
}

export async function getObjectBytes(kind: BucketKind, key: string): Promise<Uint8Array> {
  const result = await s3().send(new GetObjectCommand({ Bucket: bucketName(kind), Key: key }));
  if (!result.Body) throw new Error('Objeto vazio no storage.');
  return result.Body.transformToByteArray();
}

export async function deleteObject(kind: BucketKind, key: string): Promise<void> {
  await s3().send(new DeleteObjectCommand({ Bucket: bucketName(kind), Key: key }));
}

/** URL temporária para o painel ver uma foto privada. */
export async function getSignedUrl(key: string, expiresInSeconds = 300): Promise<string> {
  return presign(s3ForSigning(), new GetObjectCommand({ Bucket: bucketName('private'), Key: key }), { expiresIn: expiresInSeconds });
}

/** URL pública de um derivado aprovado. */
export function publicUrl(key: string): string {
  return `${env('S3_PUBLIC_BASE_URL').replace(/\/$/, '')}/${key}`;
}

export function isStorageConfigured(): boolean {
  return ['S3_ENDPOINT', 'S3_REGION', 'S3_BUCKET_PRIVATE', 'S3_BUCKET_PUBLIC', 'S3_PUBLIC_BASE_URL', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY'].every(
    (name) => !!process.env[name],
  );
}
