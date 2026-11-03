import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { curriculumGroups } from '@/data/curriculums';
import { legacyWall } from '@/data/legacy';
import { siteImageSlots } from '@/data/site-images';
import { processContentImage } from '@/lib/content/image';
import { ImageRejectedError } from '@/lib/mural/image';
import { curriculumFormSchema, siteImageFormSchema } from '@/lib/validation/admin';

describe('espaços de foto do site', () => {
  it('têm chaves únicas', () => {
    const keys = siteImageSlots.map((slot) => slot.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('cobrem todos os mestres do Mural do Legado e as fotos já usadas', () => {
    const keys = new Set(siteImageSlots.map((slot) => slot.key));
    for (const master of legacyWall) expect(keys.has(`legado-${master.id}`)).toBe(true);
    for (const key of ['home-hero', 'home-unidade', 'sobre-historia', 'marca-selo-premium', 'marca-logo-escola']) expect(keys.has(key)).toBe(true);
  });

  it('pedem descrição da foto', () => {
    expect(siteImageFormSchema.safeParse({ alt: '  ' }).success).toBe(false);
    expect(siteImageFormSchema.parse({ alt: ' Treino de terça ' }).alt).toBe('Treino de terça');
  });
});

describe('formulário de currículo', () => {
  it('aceita mês AAAA-MM ou vazio', () => {
    expect(curriculumFormSchema.parse({ version: '4.1', referenceMonth: '2026-11' }).referenceMonth).toBe('2026-11');
    expect(curriculumFormSchema.parse({ version: '4.1', referenceMonth: '' }).referenceMonth).toBeNull();
    expect(curriculumFormSchema.safeParse({ version: '4.1', referenceMonth: '2026-13' }).success).toBe(false);
    expect(curriculumFormSchema.safeParse({ version: '', referenceMonth: '' }).success).toBe(false);
  });

  it('slugs dos currículos são únicos', () => {
    const slugs = curriculumGroups.flatMap((group) => group.items.map((item) => item.slug));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('reprocessamento das imagens do painel', () => {
  it('gera as versões pedidas em WebP, sem aumentar imagem pequena e sem EXIF', async () => {
    const input = await sharp({ create: { width: 3600, height: 4800, channels: 3, background: '#ffffff' } })
      .jpeg()
      .withExif({ IFD0: { Artist: 'Fulano' } })
      .toBuffer();
    const [full, preview] = await processContentImage(input, [{ width: 1800 }, { width: 800 }]);
    expect([full.width, full.height]).toEqual([1800, 2400]);
    expect([preview.width, preview.height]).toEqual([800, 1067]);
    expect((await sharp(full.data).metadata()).exif).toBeUndefined();

    const small = await sharp({ create: { width: 300, height: 200, channels: 4, background: '#00000000' } }).png().toBuffer();
    const [kept] = await processContentImage(small, [{ width: 600, height: 600 }]);
    expect([kept.width, kept.height]).toEqual([300, 200]);
    // PNG transparente (logo) continua transparente.
    expect((await sharp(kept.data).metadata()).hasAlpha).toBe(true);
  });

  it('recusa o que não é JPG, PNG ou WebP de verdade', async () => {
    await expect(processContentImage(new TextEncoder().encode('%PDF-1.7 ...'), [{ width: 800 }])).rejects.toBeInstanceOf(ImageRejectedError);
    await expect(processContentImage(new Uint8Array(), [{ width: 800 }])).rejects.toBeInstanceOf(ImageRejectedError);
    const truncated = (await sharp({ create: { width: 64, height: 64, channels: 3, background: '#000' } }).jpeg().toBuffer()).subarray(0, 120);
    await expect(processContentImage(truncated, [{ width: 800 }])).rejects.toBeInstanceOf(ImageRejectedError);
  });
});
