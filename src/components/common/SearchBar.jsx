import React from 'react';
import { Search, X } from 'lucide-react';
import Input from './Input';

/**
 * SearchBar — Componente reutilizable para búsqueda de productos.
 */
export default function SearchBar({ value, onChange, onClear, placeholder = 'Buscar por nombre, marca o nota olfativa...' }) {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        icon={Search}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
          title="Limpiar búsqueda"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
