import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * ActiveFilters — Resume los filtros aplicados y permite retirarlos sin
 * volver a abrir el panel lateral. No renderiza nada cuando no hay filtros.
 */
export default function ActiveFilters({ filters = [], onClearAll }) {
  if (filters.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      aria-label="Filtros activos"
      className="mb-8 overflow-hidden rounded-2xl border border-[#C8A450]/35 bg-white px-4 py-3 sm:px-5"
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#4B1E28]">
          Filtros activos
        </span>

        <AnimatePresence initial={false} mode="popLayout">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              type="button"
              layout
              initial={{ opacity: 0, scale: 0.88, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={filter.onRemove}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#C8A450]/50 bg-[#F6F0E3] px-3 py-1.5 text-xs font-medium text-[#4B1E28] transition-colors hover:bg-[#4B1E28] hover:text-white"
              aria-label={`Quitar filtro ${filter.label}`}
            >
              <span>{filter.label}</span>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </motion.button>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={onClearAll}
          className="ml-1 text-xs font-semibold text-[#4B1E28] underline-offset-4 transition-colors hover:text-[#111111] hover:underline"
        >
          Limpiar todos
        </button>
      </div>
    </motion.section>
  );
}
