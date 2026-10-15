import Image from 'next/image';
import { categoryLabel } from '@/data/mural';
import type { PublicMuralPost } from '@/types/mural';

/** Texto alternativo a partir do que é publicável: categoria, legenda e nome autorizados. */
export function muralAlt(post: PublicMuralPost): string {
  const parts = [`Foto do mural: ${categoryLabel[post.category]}`];
  if (post.caption) parts.push(post.caption);
  if (post.studentName) parts.push(`enviada por ${post.studentName}`);
  return parts.join('. ');
}

/** Foto aprovada com dimensões conhecidas, para não deslocar o layout ao carregar. */
export function MuralPhoto({ post, sizes, className = '', priority = false }: { post: PublicMuralPost; sizes: string; className?: string; priority?: boolean }) {
  return (
    <Image
      src={post.imageUrl}
      alt={muralAlt(post)}
      width={post.width}
      height={post.height}
      sizes={sizes}
      priority={priority}
      className={`h-auto w-full bg-gb-line ${className}`}
    />
  );
}
