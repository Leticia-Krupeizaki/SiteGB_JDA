import sharp from 'sharp';
import { beforeAll, describe, expect, it } from 'vitest';
import { ImageRejectedError, makePublicDerivative, processUpload } from '@/lib/mural/image';
import { toPublicPost } from '@/lib/mural/posts';

async function jpegWithExif() {
  return sharp({ create: { width: 64, height: 32, channels: 3, background: '#d71921' } })
    .jpeg()
    .withExif({ IFD0: { Copyright: 'teste', Artist: 'Fulano' } })
    .toBuffer();
}

describe('reprocessamento da foto enviada', () => {
  it('aceita JPG real, reencoda em WebP e remove EXIF', async () => {
    const input = await jpegWithExif();
    expect((await sharp(input).metadata()).exif).toBeDefined();

    const result = await processUpload(input);
    expect(result.contentType).toBe('image/webp');
    expect([result.width, result.height]).toEqual([64, 32]);
    const meta = await sharp(result.data).metadata();
    expect(meta.format).toBe('webp');
    expect(meta.exif).toBeUndefined();
  });

  it('confere o tipo pelo conteúdo, não pela extensão', async () => {
    const gif = await sharp({ create: { width: 4, height: 4, channels: 3, background: '#000' } }).gif().toBuffer();
    await expect(processUpload(gif)).rejects.toBeInstanceOf(ImageRejectedError);
    await expect(processUpload(new TextEncoder().encode('<script>alert(1)</script>'))).rejects.toBeInstanceOf(ImageRejectedError);
  });

  it('recusa arquivo vazio e JPG corrompido', async () => {
    await expect(processUpload(new Uint8Array())).rejects.toBeInstanceOf(ImageRejectedError);
    const truncated = (await jpegWithExif()).subarray(0, 120);
    await expect(processUpload(truncated)).rejects.toBeInstanceOf(ImageRejectedError);
  });

  it('gera derivado público limitado ao tamanho configurado', async () => {
    const big = await sharp({ create: { width: 3000, height: 1500, channels: 3, background: '#002f80' } }).png().toBuffer();
    const derivative = await makePublicDerivative((await processUpload(big)).data);
    expect(derivative.width).toBe(1600);
    expect(derivative.height).toBe(800);
  });
});

describe('payload público', () => {
  beforeAll(() => {
    process.env.S3_PUBLIC_BASE_URL = 'https://fotos.exemplo.com/';
  });

  const row = {
    id: '00000000-0000-4000-8000-000000000001',
    category: 'TREINOS' as const,
    studentName: 'Ana',
    showNamePublicly: false,
    caption: 'Treino de terça',
    showCaptionPublicly: false,
    publicObjectKey: 'mural/abc.webp',
    width: 800,
    height: 600,
  };

  it('omite nome e legenda sem consentimento e nunca leva contato', () => {
    const post = toPublicPost(row);
    expect(post).toEqual({ id: row.id, category: 'TREINOS', imageUrl: 'https://fotos.exemplo.com/mural/abc.webp', width: 800, height: 600 });
    expect(JSON.stringify(post)).not.toMatch(/contact/i);
  });

  it('inclui nome e legenda quando autorizados', () => {
    const post = toPublicPost({ ...row, showNamePublicly: true, showCaptionPublicly: true });
    expect(post.studentName).toBe('Ana');
    expect(post.caption).toBe('Treino de terça');
  });
});
