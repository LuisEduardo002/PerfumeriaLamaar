import React from 'react';
import { ArrowUpDown } from 'lucide-react';

/**
 * SortSelect — Selector para ordenar perfumes.
 */
export default function SortSelect({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 text-sm">
      <ArrowUpDown className="w-4 h-4 text-slate-400" />
      <span className="text-xs uppercase tracking-wider text-slate-400 font-medium hidden sm:inline">Ordenar:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer pr-2"
      >
        <option value="featured">Destacados</option>
        <option value="price-asc">Precio: Menor a Mayor</option>
        <option value="price-desc">Precio: Mayor a Menor</option>
        <option value="name-asc">Nombre: A-Z</option>
      </select>
    </div>
  );
}
