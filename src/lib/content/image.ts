import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import { ImageRejectedError, type ProcessedImage } from '@/lib/mural/image';

/** Envios do painel (fotos do site e pôsteres de currículo). */
export const contentLimits = {
  maxFileBytes: 20 * 1024 * 1024,
  /** Folga para os outros campos do multipart. */
  maxRequestBytes: 20 * 1024 * 1024 + 256 * 1024,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
  maxInputPixels: 60_000_000,
};

const acceptedMimes = new Set<string>(contentLimits.acceptedTypes);

export type Resize = { width: number; height?: number };

/**
 * Valida o arquivo pelos magic bytes, decodifica de verdade e gera uma ou mais
 * versões WebP (sem EXIF/GPS), cada uma no máximo do tamanho pedido.
 * Mesmas regras do envio do mural, com limites maiores para o administrador.
 */
export async function processContentImage(input: Uint8Array, variants: Resize[], quality = 85): Promise<ProcessedImage[]> {
  if (input.byteLength === 0) throw new ImageRejectedError('O arquivo está vazio.');
  if (input.byteLength > contentLimits.maxFileBytes) throw new ImageRejectedError('O arquivo deve ter no máximo 20 MB.');

  const type = await fileTypeFromBuffer(input);
  if (!type || !acceptedMimes.has(type.mime)) throw new ImageRejectedError('Envie uma imagem em JPG, PNG ou WebP.');

  // Orientação aplicada antes de reduzir; cada versão sai de um clone do mesmo arquivo.
  const source = sharp(input, { limitInputPixels: contentLimits.maxInputPixels, failOn: 'error' }).rotate();
  try {
    return await Promise.all(
      variants.map(async ({ width, height }) => {
        const { data, info } = await source
          .clone()
          .resize({ width, height, fit: 'inside', withoutEnlargement: true })
          .webp({ quality })
          .toBuffer({ resolveWithObject: true });
        return { data, width: info.width, height: info.height, contentType: 'image/webp' as const };
      }),
    );
  } catch (error) {
    if (error instanceof Error && /pixel limit/i.test(error.message)) {
      throw new ImageRejectedError('A imagem tem resolução grande demais. Envie uma versão menor.');
    }
    throw new ImageRejectedError('Não foi possível ler a imagem. Envie outro arquivo.');
  }
}
