import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import { muralLimits } from '@/data/mural';

/** Arquivo recusado por motivo que pode ser mostrado ao visitante. */
export class ImageRejectedError extends Error {}

export type ProcessedImage = { data: Buffer; width: number; height: number; contentType: 'image/webp' };

const acceptedMimes = new Set<string>(muralLimits.acceptedTypes);

/**
 * Valida e reprocessa a foto enviada:
 * - confere o tipo pelos magic bytes, não pelo que o navegador declarou;
 * - decodifica de verdade (arquivo corrompido é recusado);
 * - limita a quantidade de pixels processáveis;
 * - aplica a orientação e reencoda, o que descarta EXIF e GPS.
 */
export async function processUpload(input: Uint8Array): Promise<ProcessedImage> {
  if (input.byteLength === 0) throw new ImageRejectedError('O arquivo está vazio.');
  if (input.byteLength > muralLimits.maxFileBytes) throw new ImageRejectedError('A foto deve ter no máximo 10 MB.');

  const type = await fileTypeFromBuffer(input);
  if (!type || !acceptedMimes.has(type.mime)) throw new ImageRejectedError('Envie uma foto em JPG, PNG ou WebP.');

  try {
    const { data, info } = await sharp(input, { limitInputPixels: muralLimits.maxInputPixels, failOn: 'error' })
      .rotate()
      .resize({ width: muralLimits.maxStoredSide, height: muralLimits.maxStoredSide, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90 })
      .toBuffer({ resolveWithObject: true });
    return { data, width: info.width, height: info.height, contentType: 'image/webp' };
  } catch (error) {
    if (error instanceof Error && /pixel limit/i.test(error.message)) {
      throw new ImageRejectedError('A foto tem resolução grande demais. Envie uma versão menor.');
    }
    throw new ImageRejectedError('Não foi possível ler a imagem. Envie outro arquivo.');
  }
}

/** Versão pública, menor e mais leve, gerada só na aprovação. */
export async function makePublicDerivative(original: Uint8Array): Promise<ProcessedImage> {
  const { data, info } = await sharp(original)
    .resize({ width: muralLimits.publicSide, height: muralLimits.publicSide, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, contentType: 'image/webp' };
}
