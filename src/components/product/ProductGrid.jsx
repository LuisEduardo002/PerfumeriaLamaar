import { motion } from 'framer-motion';
import { PackageSearch } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function ProductGrid({
  products = [],
  loading = false,
  emptyMessage = 'No se encontraron perfumes que coincidan con tu búsqueda.',
  onProductNavigate,
  isRestoring = false // 1. Recibimos el prop
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => <ProductCardSkeleton key={index} />)}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="my-4 rounded-3xl border border-stone-200 bg-white p-8 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F6F0E3] text-[#4B1E28]">
          <PackageSearch className="h-8 w-8" />
        </div>
        <h3 className="mb-2 font-serif text-xl font-bold text-[#111111]">Sin resultados</h3>
        <p className="mx-auto max-w-md text-sm text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      // 2. Si venimos de "Atrás", bloqueamos la animación inicial del contenedor
      initial={isRestoring ? false : 'hidden'}
      animate={isRestoring ? undefined : 'show'}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          // 3. Desactivamos el efecto cascada (stagger) al volver atrás
          transition: { staggerChildren: isRestoring ? 0 : 0.08 }
        }
      }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {products.map((perfume) => (
        <ProductCard
          key={perfume.id}
          perfume={perfume}
          onProductNavigate={onProductNavigate}
          isRestoring={isRestoring} // 4. Le pasamos el prop a la tarjeta (junto con tu React.memo)
        />
      ))}
    </motion.div>
  );
}