'use client';

import { useEffect, useRef, useState } from 'react';
import { PlaceholderNotice } from '@/components/ui/PlaceholderNotice';
import { whatsappUrl } from '@/config/site';
import { PhotoUploadForm } from './PhotoUploadForm';
import { RemovalRequestForm } from './RemovalRequestForm';

type Panel = 'enviar' | 'retirar';

const options: { id: Panel; title: string; text: string }[] = [
  { id: 'enviar', title: 'Enviar uma foto', text: 'Treino, graduação, campeonato ou evento. A equipe revisa antes de publicar.' },
  { id: 'retirar', title: 'Pedir remoção de foto', text: 'Aparece em uma foto do mural e quer que ela seja retirada?' },
];

const removalWhatsapp = whatsappUrl('Olá! Gostaria de pedir a retirada de uma foto do mural da Gracie Barra Jardim das Américas.');

/**
 * Dois caminhos do mural: enviar foto ou pedir remoção. Cada botão abre o seu
 * formulário (passo a passo no celular). `#enviar` e `#retirar` na URL abrem direto.
 */
export function MuralActions() {
  const [open, setOpen] = useState<Panel | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Links como /mural#enviar (botão da Home) já abrem o fluxo certo.
  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'enviar' || hash === 'retirar') setOpen(hash);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const choose = (panel: Panel) => {
    setOpen(panel);
    history.replaceState(null, '', `#${panel}`);
    requestAnimationFrame(() => panelRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const active = open === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-expanded={active}
              aria-controls={`painel-${option.id}`}
              onClick={() => choose(option.id)}
              className={`focus-ring flex min-h-24 flex-col items-start gap-1 border-2 p-5 text-left transition-colors ${
                active
                  ? option.id === 'enviar'
                    ? 'border-gb-red bg-gb-red text-gb-white'
                    : 'border-gb-ink bg-gb-ink text-gb-white'
                  : 'border-gb-ink bg-gb-white text-gb-ink hover:bg-gb-line/60'
              }`}
            >
              <span className="font-display text-2xl font-bold uppercase">{option.title}</span>
              <span className={`text-sm ${active ? 'text-gb-white/90' : 'text-gb-mute'}`}>{option.text}</span>
            </button>
          );
        })}
      </div>

      <div ref={panelRef} className="scroll-mt-24">
        {open === 'enviar' && (
          <div id="painel-enviar" className="max-w-3xl space-y-6">
            <p className="text-sm text-gb-mute">
              Sem cadastro. Seu contato é usado só pela equipe e nunca aparece no site; nome e legenda só são exibidos com a sua autorização.
            </p>
            <PhotoUploadForm />
          </div>
        )}

        {open === 'retirar' && (
          <div id="painel-retirar" className="max-w-3xl space-y-6">
            <p className="text-sm text-gb-mute">
              Descreva a foto e a equipe retorna pelo contato informado. Se preferir,{' '}
              <a href={removalWhatsapp} target="_blank" rel="noopener noreferrer" className="focus-ring font-semibold text-gb-navy underline">
                peça pelo WhatsApp
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
              .
            </p>
            <RemovalRequestForm />
          </div>
        )}

        {open && (
          <div className="mt-8 max-w-3xl">
            <PlaceholderNotice>texto final da política de privacidade e do termo de autorização de imagem, a ser aprovado pelo cliente.</PlaceholderNotice>
          </div>
        )}
      </div>
    </div>
  );
}
