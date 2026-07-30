import Button from '../common/Button';
import Price from '../common/Price';
import { MessageCircle } from 'lucide-react';
import { openWhatsApp } from '../../utils/whatsapp';

export default function CartSummary({ items, total }) {
  return (
    <section className="border-t border-stone-200 pt-5">
      <div className="flex items-center justify-between text-sm text-slate-600"><span>Subtotal</span><Price value={total} size="sm" /></div>
      <div className="mt-3 flex items-center justify-between"><span className="font-serif text-xl text-[#111111]">Total</span><Price value={total} size="lg" /></div>
      <Button fullWidth className="mt-5 gap-2 bg-[#4B1E28] hover:bg-[#35151d]" onClick={() => openWhatsApp(items, total)}>
        <MessageCircle className="h-4 w-4" /> Comprar por WhatsApp
      </Button>
    </section>
  );
}
