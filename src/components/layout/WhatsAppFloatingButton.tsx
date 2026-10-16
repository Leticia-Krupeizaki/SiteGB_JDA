import { whatsappTrialUrl } from '@/config/site';
import { WhatsAppIcon } from '@/components/ui/icons';

/**
 * Botão flutuante. Some quando o menu mobile está aberto (via `data-menu-open`
 * no body) para não sobrepor a navegação.
 */
export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappTrialUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring fixed right-4 bottom-4 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1f8f4e] text-gb-white shadow-lg transition-transform hover:scale-105 in-data-menu-open:hidden sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="sr-only">Falar pelo WhatsApp (abre em nova aba)</span>
    </a>
  );
}
