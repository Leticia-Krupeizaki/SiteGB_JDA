import Image from 'next/image';
import { muralAlt } from '@/components/mural/MuralPhoto';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { muralPosts } from '@/data/mural';

const slots = ['', 'translate-y-8'];

/** As fotos mais recentes do mural (src/data/mural.ts); sem fotos, mostra os quadros vazios. */
export function MuralPreview() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:order-1">
      {slots.map((offset, i) => {
        const post = muralPosts[i];
        return post ? (
          <div key={post.id} className={`relative aspect-square overflow-hidden bg-gb-line ${offset}`}>
            <Image src={post.imageUrl} alt={muralAlt(post)} fill sizes="(min-width: 1024px) 270px, 50vw" className="object-cover" />
          </div>
        ) : (
          <PhotoPlaceholder key={i} label="Foto do mural" className={`aspect-square ${offset}`} />
        );
      })}
    </div>
  );
}
