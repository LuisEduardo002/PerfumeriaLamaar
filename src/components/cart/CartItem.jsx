import { Minus, Plus, Trash2 } from 'lucide-react';
import Price from '../common/Price';

export default function CartItem({ item, onDecrease, onIncrease, onRemove }) {
  const atStockLimit = item.quantity >= item.stock;

  return (
    <article className="flex gap-4 py-5">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
        <img src={item.imagen} alt={`Perfume ${item.nombre}`} className="h-full w-full object-contain p-1" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#4B1E28]">{item.marca}</p>
            <h3 className="mt-1 truncate font-serif text-lg text-[#111111]">{item.nombre}</h3>
            <Price value={item.precio} size="sm" />
          </div>
          <button type="button" onClick={() => onRemove(item.id)} aria-label={`Eliminar ${item.nombre}`} className="p-1 text-slate-400 transition-colors hover:text-[#4B1E28]"><Trash2 className="h-4 w-4" /></button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center rounded-full border border-stone-200">
            <button type="button" onClick={() => onDecrease(item.id)} aria-label="Reducir cantidad" className="p-2"><Minus className="h-3.5 w-3.5" /></button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button type="button" disabled={atStockLimit} onClick={() => onIncrease(item.id)} aria-label="Aumentar cantidad" className="p-2 disabled:text-slate-300"><Plus className="h-3.5 w-3.5" /></button>
          </div>
          <Price value={item.precio * item.quantity} size="sm" />
        </div>
      </div>
    </article>
  );
}
