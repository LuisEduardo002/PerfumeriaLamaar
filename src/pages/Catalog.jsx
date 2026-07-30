import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import SectionTitle from '../components/common/SectionTitle';
import SearchBar from '../components/common/SearchBar';
import FilterSidebar from '../components/common/FilterSidebar';
import SortSelect from '../components/common/SortSelect';
import ProductGrid from '../components/product/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { SlidersHorizontal, X } from 'lucide-react';
import Button from '../components/common/Button';

/**
 * Catalog — Página de catálogo de la tienda de perfumes.
 */
export default function Catalog() {
  const [searchParams] = useSearchParams();
  const {
    products,
    totalCount,
    categories,
    brands,
    loading,
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedGender,
    sortBy,
    setSearchTerm,
    setSelectedCategory,
    setSelectedBrand,
    setSelectedGender,
    setSortBy,
    resetFilters,
  } = useProducts();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const gender = searchParams.get('genero');
    if (['Masculino', 'Femenino', 'Unisex'].includes(gender)) {
      setSelectedGender(gender);
    }
  }, [searchParams, setSelectedGender]);

  return (
    <main className="flex-grow bg-slate-50/50 py-10">
      <Container>
        {/* Banner de Cabecera */}
        <SectionTitle
          title="Catálogo de Fragancias"
          subtitle="Explora nuestra exclusiva selección de perfumes de diseñador, arabes y fragancias nicho."
        />

        {/* Barra superior de Búsqueda y Ordenamiento */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="w-full md:w-96">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
            />
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            {/* Botón de Filtros para Mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Mostrando <strong className="text-slate-900">{totalCount}</strong> fragancias
              </span>
              <SortSelect value={sortBy} onChange={setSortBy} />
            </div>
          </div>
        </div>

        {/* Layout Principal: Sidebar + Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block col-span-1 sticky top-28">
            <FilterSidebar
              categories={categories}
              brands={brands}
              selectedCategory={selectedCategory}
              selectedBrand={selectedBrand}
              selectedGender={selectedGender}
              onSelectCategory={setSelectedCategory}
              onSelectBrand={setSelectedBrand}
              onSelectGender={setSelectedGender}
              onResetFilters={resetFilters}
            />
          </div>

          {/* Mobile Filter Drawer Modal */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/50 backdrop-blur-xs">
              <div className="w-4/5 max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <h3 className="font-serif text-xl font-bold text-slate-900">Filtros</h3>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-2 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <FilterSidebar
                    categories={categories}
                    brands={brands}
                    selectedCategory={selectedCategory}
                    selectedBrand={selectedBrand}
                    selectedGender={selectedGender}
                    onSelectCategory={(c) => {
                      setSelectedCategory(c);
                      setMobileFiltersOpen(false);
                    }}
                    onSelectBrand={(b) => {
                      setSelectedBrand(b);
                      setMobileFiltersOpen(false);
                    }}
                    onSelectGender={(g) => {
                      setSelectedGender(g);
                      setMobileFiltersOpen(false);
                    }}
                    onResetFilters={() => {
                      resetFilters();
                      setMobileFiltersOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Product Grid Area */}
          <div className="col-span-1 md:col-span-3">
            {loading ? (
              <div className="py-20 text-center text-slate-400">Cargando catálogo...</div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
