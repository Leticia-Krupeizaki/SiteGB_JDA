import Image, { type ImageProps } from 'next/image';
import type { SiteImage } from '@/lib/content/site-images';

/** Foto de um espaço do site (src/data/site-images.ts), com desfoque opcional enquanto carrega. */
export function SitePhoto({ image, blur = false, ...props }: { image: SiteImage; blur?: boolean } & Omit<ImageProps, 'src' | 'alt' | 'placeholder'>) {
  return (
    <Image
      {...props}
      src={image.src}
      alt={image.alt}
      placeholder={blur && image.src.blurDataURL ? 'blur' : 'empty'}
    />
  );
}
