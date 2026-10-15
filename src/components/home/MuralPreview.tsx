'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { muralAlt } from '@/components/mural/MuralPhoto';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import type { PublicMuralPage, PublicMuralPost } from '@/types/mural';

const slots = ['', 'translate-y-8'];

/**
 * Últimas fotos aprovadas do mural. Busca no navegador para a Home continuar
 * estática; enquanto não houver fotos (ou se a API falhar), mostra os quadros vazios.
 */
export function MuralPreview() {
  const [posts, setPosts] = useState<PublicMuralPost[]>([]);

  useEffect(() => {
    fetch(`/api/mural?limit=${slots.length}`)
      .then((response) => (response.ok ? (response.json() as Promise<PublicMuralPage>) : null))
      .then((page) => page && setPosts(page.items))
      .catch(() => undefined);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 lg:order-1">
      {slots.map((offset, i) => {
        const post = posts[i];
        return post ? (
          <div key={post.id} className={`relative aspect-square overflow-hidden bg-gb-line ${offset}`}>
            <Image src={post.imageUrl} alt={muralAlt(post)} fill unoptimized className="object-cover" />
          </div>
        ) : (
          <PhotoPlaceholder key={i} label="Foto do mural" className={`aspect-square ${offset}`} />
        );
      })}
    </div>
  );
}
