import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import useCartStore from '../../store/useCartStore';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Price from '../common/Price';

export default function ProductCard({ perfume }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [imageStatus, setImageStatus] = useState('loading');
  const isAvailable = perfume.stock > 0;

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(perfume);
    toast.success(`${perfume.nombre} fue agregado al carrito`);
  };

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="absolute left-6 top-6 z-10">
        {perfume.categoria && <Badge variant="primary" className="bg-white/90 shadow-xs backdrop-blur-md">{perfume.categoria}</Badge>}
      </div>

      <Link to={`/producto/${perfume.id}`} className="block flex-1" aria-label={`Ver ${perfume.nombre}`}>
        <div className="relative mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white">
          {imageStatus === 'loading' && <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-gradient-to-br from-white via-stone-50 to-stone-100" />}
          {imageStatus !== 'error' ? (
            <img src={perfume.imagen} alt={perfume.nombre} className={`h-full w-full object-contain p-4 transition-all duration-500 group-hover:scale-105 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImageStatus('loaded')} onError={() => setImageStatus('error')} />
          ) : (
            <div className="flex flex-col items-center px-4 text-center"><span className="font-serif text-2xl text-stone-300">{perfume.marca}</span><span className="mt-1 text-xs uppercase tracking-wider text-slate-400">{perfume.nombre}</span></div>
          )}
        </div>
        <div className="mb-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4B1E28]">{perfume.marca}</p>
          <h3 className="line-clamp-1 font-serif text-lg font-bold text-[#111111] transition-colors group-hover:text-[#4B1E28]">{perfume.nombre}</h3>
          <p className="line-clamp-1 text-xs font-light text-slate-500">{perfume.genero} · {perfume.ml} ml</p>
        </div>
      </Link>

      <div className="flex items-center justify-between border-t border-stone-100 pt-3">
        <div><span className="block text-[10px] font-medium uppercase text-slate-400">Precio</span><Price value={perfume.precio} size="md" /></div>
        <Button variant="primary" size="sm" disabled={!isAvailable} onClick={handleAddToCart} className="flex items-center gap-2" title={isAvailable ? 'Agregar al carrito' : 'Producto agotado'}>
          <ShoppingBag className="h-4 w-4" /><span className="hidden sm:inline">{isAvailable ? 'Agregar' : 'Agotado'}</span>
        </Button>
      </div>
    </motion.article>
  );
}
