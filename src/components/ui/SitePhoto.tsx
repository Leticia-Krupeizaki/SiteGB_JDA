import Image, { type ImageProps } from 'next/image';
import type { SiteImage } from '@/lib/content/site-images';

/**
 * Foto trocável pelo painel. A enviada já sai do servidor no tamanho certo e vem
 * de outro domínio (storage), então vai `unoptimized`; a padrão passa pelo
 * otimizador do Next. Desfoque de carregamento só existe na padrão.
 */
export function SitePhoto({ image, blur = false, ...props }: { image: SiteImage; blur?: boolean } & Omit<ImageProps, 'src' | 'alt' | 'unoptimized' | 'placeholder'>) {
  return (
    <Image
      {...props}
      src={image.src}
      alt={image.alt}
      unoptimized={image.custom}
      placeholder={blur && image.src.blurDataURL ? 'blur' : 'empty'}
    />
  );
}
