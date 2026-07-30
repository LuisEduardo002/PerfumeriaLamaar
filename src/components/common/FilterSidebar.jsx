import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

/**
 * FilterSidebar — Panel lateral para filtrado de perfumes por categoría, marca y género.
 */
export default function FilterSidebar({
  categories = [],
  brands = [],
  selectedCategory,
  selectedBrand,
  selectedGender,
  onSelectCategory,
  onSelectBrand,
  onSelectGender,
  onResetFilters,
}) {
  const genders = ['Todos', 'Masculino', 'Femenino', 'Unisex'];

  const hasActiveFilters = selectedCategory || selectedBrand || (selectedGender && selectedGender !== 'Todos');

  return (
    <aside className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#C8A450]" />
          <h3 className="font-serif text-lg font-bold text-[#111111]">Filtros</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex cursor-pointer items-center gap-1 text-xs font-medium text-[#4B1E28] transition-colors hover:text-[#111111]"
          >
            <RotateCcw className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Filtro por Género */}
      <div>
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">
          Género
        </h4>
        <div className="flex flex-wrap gap-2">
          {genders.map((gender) => {
            const isSelected = (gender === 'Todos' && !selectedGender) || selectedGender === gender;
            return (
              <button
                key={gender}
                onClick={() => onSelectGender(gender === 'Todos' ? '' : gender)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#111111] bg-[#111111] text-white font-medium'
                    : 'border-[#CFCFCF] bg-[#FAF9F6] text-slate-600 hover:border-[#C8A450]'
                }`}
              >
                {gender}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtro por Categoría */}
      <div>
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">
          Categorías
        </h4>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onSelectCategory('')}
              className={`w-full text-left text-sm py-1.5 px-3 rounded-xl transition-colors cursor-pointer ${
                !selectedCategory
                  ? 'bg-[#F6F0E3] text-[#4B1E28] font-semibold'
                  : 'text-slate-600 hover:bg-[#FAF9F6]'
              }`}
            >
              Todas las categorías
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-left text-sm py-1.5 px-3 rounded-xl transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#F6F0E3] text-[#4B1E28] font-semibold'
                    : 'text-slate-600 hover:bg-[#FAF9F6]'
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Filtro por Marca */}
      <div>
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">
          Marcas
        </h4>
        <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <li>
            <button
              onClick={() => onSelectBrand('')}
              className={`w-full text-left text-sm py-1.5 px-3 rounded-xl transition-colors cursor-pointer ${
                !selectedBrand
                  ? 'bg-[#F6F0E3] text-[#4B1E28] font-semibold'
                  : 'text-slate-600 hover:bg-[#FAF9F6]'
              }`}
            >
              Todas las marcas
            </button>
          </li>
          {brands.map((brand) => (
            <li key={brand}>
              <button
                onClick={() => onSelectBrand(brand)}
                className={`w-full text-left text-sm py-1.5 px-3 rounded-xl transition-colors cursor-pointer ${
                  selectedBrand === brand
                    ? 'bg-[#F6F0E3] text-[#4B1E28] font-semibold'
                    : 'text-slate-600 hover:bg-[#FAF9F6]'
                }`}
              >
                {brand}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
