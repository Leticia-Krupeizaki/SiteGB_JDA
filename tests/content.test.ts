import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { curriculumGroups } from '@/data/curriculums';
import { instructors } from '@/data/instructors';
import { legacyWall } from '@/data/legacy';
import { muralCategories, muralPosts } from '@/data/mural';
import { siteImageSlots } from '@/data/site-images';

describe('espaços de foto do site', () => {
  it('têm chaves únicas', () => {
    const keys = siteImageSlots.map((slot) => slot.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('cobrem todos os mestres do Mural do Legado e as fotos já usadas', () => {
    const keys = new Set(siteImageSlots.map((slot) => slot.key));
    for (const master of legacyWall) expect(keys.has(`legado-${master.id}`)).toBe(true);
    for (const instructor of instructors) expect(keys.has(`professor-${instructor.id}`)).toBe(true);
    for (const key of ['home-unidade', 'sobre-historia', 'marca-selo-premium', 'marca-logo-escola']) expect(keys.has(key)).toBe(true);
  });

  it('toda foto definida tem descrição', () => {
    for (const slot of siteImageSlots) if (slot.image) expect(slot.image.alt.trim(), slot.key).not.toBe('');
  });
});

describe('currículos', () => {
  it('slugs dos currículos são únicos', () => {
    const slugs = curriculumGroups.flatMap((group) => group.items.map((item) => item.slug));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('fotos do mural', () => {
  const categories = new Set(muralCategories.map((category) => category.id));

  it('têm id único, categoria válida e o arquivo em public/', () => {
    const ids = muralPosts.map((post) => post.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const post of muralPosts) {
      expect(categories.has(post.category), post.id).toBe(true);
      expect(post.imageUrl.startsWith('/fotos/mural/'), post.id).toBe(true);
      expect(existsSync(join('public', post.imageUrl)), post.imageUrl).toBe(true);
      expect(post.width > 0 && post.height > 0, post.id).toBe(true);
    }
  });
});
