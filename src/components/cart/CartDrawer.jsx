import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { toast } from 'sonner';
import useCartStore from '../../store/useCartStore';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import Button from '../common/Button';

export default function CartDrawer({ isOpen, onClose }) {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = useCartStore((state) => state.getTotal());

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60]">
          <motion.button type="button" aria-label="Cerrar carrito" className="absolute inset-0 h-full w-full bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside role="dialog" aria-modal="true" aria-label="Carrito de compras" className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#FAF9F6] p-5 shadow-2xl sm:p-7" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', ease: 'easeOut', duration: 0.28 }}>
            <header className="flex items-center justify-between border-b border-stone-200 pb-5">
              <div><p className="text-xs uppercase tracking-[0.18em] text-[#4B1E28]">Tu selección</p><h2 className="mt-1 font-serif text-2xl text-[#111111]">Carrito</h2></div>
              <button type="button" onClick={onClose} aria-label="Cerrar carrito" className="rounded-full p-2 hover:bg-stone-200"><X className="h-5 w-5" /></button>
            </header>
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center"><ShoppingBag className="h-10 w-10 text-[#C8A450]" /><h3 className="mt-4 font-serif text-xl">Tu carrito está vacío</h3><p className="mt-2 max-w-xs text-sm text-slate-500">Explora el catálogo y elige tu próxima fragancia.</p><Button onClick={onClose} variant="outline" className="mt-6">Seguir comprando</Button></div>
            ) : (
              <><div className="flex-1 divide-y divide-stone-200 overflow-y-auto"><div className="flex justify-end py-3"><button type="button" onClick={() => { clearCart(); toast.success('Carrito vaciado'); }} className="text-xs text-slate-500 hover:text-[#4B1E28]">Vaciar carrito</button></div>{items.map((item) => <CartItem key={item.id} item={item} onRemove={(productId) => { removeFromCart(productId); toast.success('Producto eliminado del carrito'); }} onIncrease={increaseQuantity} onDecrease={decreaseQuantity} />)}</div><CartSummary items={items} total={total} /></>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
