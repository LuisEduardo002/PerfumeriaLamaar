import { Link } from 'react-router-dom';
import { MessageCircle, Store } from 'lucide-react';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function MobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#C8A450]/30 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-xl gap-3">
        <Link
          to="/catalogo"
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#CFCFCF] bg-white py-3 text-sm font-medium text-[#111111] transition-colors hover:border-[#C8A450]"
        >
          <Store className="h-4 w-4" aria-hidden="true" /> Catálogo
        </Link>
        <a
          href={buildWhatsAppLink('Hola, quiero asesoría para encontrar mi perfume ideal')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#111111] py-3 text-sm font-medium text-white transition-colors hover:bg-[#4B1E28]"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> Pedir por WhatsApp
        </a>
      </div>
    </div>
  );
}
