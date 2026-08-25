import React, { useEffect, useRef, useState } from 'react';
import { useLoaderData, useNavigationType, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';

import Container from '../components/layout/Container';
import SectionTitle from '../components/common/SectionTitle';
import SearchBar from '../components/common/SearchBar';
import FilterSidebar from '../components/common/FilterSidebar';
import SortSelect from '../components/common/SortSelect';
import ActiveFilters from '../components/common/ActiveFilters';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button';

import { useProducts } from '../hooks/useProducts';
import useSEO from '../hooks/useSEO';
import Faq from '../components/common/Faq';
import { faqItems } from '../data/faq';

const CATALOG_STATE_KEY = 'lammar-catalog-state';

export default function Catalog() {
  useSEO({
    title: 'Catálogo de Perfumes Originales para Hombre y Mujer',
    description:
      'Explora el catálogo completo de perfumes originales en LAMMAR: fragancias árabes, de diseñador y nicho para hombre y mujer. Compra fácil por WhatsApp.',
    canonical: '/catalogo',
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const navigationType = useNavigationType();
  const catalogData = useLoaderData();

  // Desactivar la restauración nativa del navegador
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  const {
    products,
    totalCount,
    visibleCount,
    hasMore,
    loadMore,
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
  } = useProducts({}, catalogData);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const restoredScrollRef = useRef(false);

  // Sincronizar el buscador con la URL cuando el usuario escribe desde el Navbar
  useEffect(() => {
    const querySearch = searchParams.get('q') || '';
    if (querySearch !== searchTerm) {
      setSearchTerm(querySearch);
    }
  }, [searchParams]);

  // Sincronizar género desde la URL solo si viene explícito en query params
  useEffect(() => {
    const gender = searchParams.get('genero');
    if (gender && ['Masculino', 'Femenino', 'Unisex'].includes(gender) && gender !== selectedGender) {
      setSelectedGender(gender);
    }
  }, [searchParams]);

  // Limpiar búsqueda local y remover el parámetro 'q' de la URL
  const handleClearSearch = () => {
    setSearchTerm('');
    if (searchParams.has('q')) {
      searchParams.delete('q');
      setSearchParams(searchParams);
    }
  };

  // Persistir el estado del catálogo en sessionStorage de forma continua
  useEffect(() => {
    if (loading || products.length === 0) return;

    try {
      const existing = JSON.parse(sessionStorage.getItem(CATALOG_STATE_KEY)) || {};
      sessionStorage.setItem(
        CATALOG_STATE_KEY,
        JSON.stringify({
          ...existing,
          searchTerm,
          selectedCategory,
          selectedBrand,
          selectedGender,
          sortBy,
          visibleCount,
        })
      );
    } catch { }
  }, [searchTerm, selectedCategory, selectedBrand, selectedGender, sortBy, visibleCount, loading, products.length]);

  // Guardar la tarjeta en la que se hizo clic y la posición del scroll
  const handleProductNavigation = (productId) => {
    try {
      const currentState = JSON.parse(sessionStorage.getItem(CATALOG_STATE_KEY)) || {};
      sessionStorage.setItem(
        CATALOG_STATE_KEY,
        JSON.stringify({
          ...currentState,
          lastProductId: productId,
          lastScrollY: window.scrollY,
        })
      );
    } catch { }
  };

  // Restaurar Scroll esperando a que las tarjetas existan físicamente en el DOM
  useEffect(() => {
    if (loading || products.length === 0 || restoredScrollRef.current) return;

    let savedState = null;
    try {
      savedState = JSON.parse(sessionStorage.getItem(CATALOG_STATE_KEY));
    } catch { }

    if (!savedState || navigationType !== 'POP') {
      // Navegación nueva: subir una sola vez. El ref evita que se repita
      // cada vez que el scroll infinito agrega más productos.
      if (navigationType !== 'POP') window.scrollTo(0, 0);
      restoredScrollRef.current = true;
      return;
    }

    const targetId = savedState.lastProductId;
    const savedY = savedState.lastScrollY;

    let attempts = 0;
    const maxAttempts = 30;

    const interval = setInterval(() => {
      attempts++;

      const targetElement = targetId
        ? document.querySelector(`[data-product-id="${targetId}"]`)
        : null;

      if (targetElement && targetElement.getBoundingClientRect().top !== 0) {
        targetElement.scrollIntoView({ block: 'center', behavior: 'instant' });
        restoredScrollRef.current = true;
        clearInterval(interval);
      } else if (savedY && document.documentElement.scrollHeight > savedY) {
        window.scrollTo(0, savedY);
        restoredScrollRef.current = true;
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [loading, products.length, navigationType]);

  const activeFilters = [
    searchTerm && {
      id: 'search',
      label: `Búsqueda: ${searchTerm}`,
      onRemove: handleClearSearch,
    },
    selectedCategory && {
      id: 'category',
      label: `Categoría: ${selectedCategory}`,
      onRemove: () => setSelectedCategory(''),
    },
    selectedBrand && {
      id: 'brand',
      label: `Marca: ${selectedBrand}`,
      onRemove: () => setSelectedBrand(''),
    },
    selectedGender && {
      id: 'gender',
      label: `Género: ${selectedGender}`,
      onRemove: () => setSelectedGender(''),
    },
  ].filter(Boolean);

  // Referencia y configuración del Scroll Infinito (Intersection Observer)
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { rootMargin: '100px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore, hasMore]);

  return (
    <main className="flex-grow bg-slate-50/50 py-10">
      <Container>
        <SectionTitle
          as="h1"
          title="Catálogo de Fragancias"
          subtitle="Explora nuestra exclusiva selección de perfumes de diseñador, árabes y fragancias nicho."
        />

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="w-full md:w-96">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={handleClearSearch}
            />
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
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
                Mostrando <strong className="text-slate-900">{visibleCount}</strong> de <strong className="text-slate-900">{totalCount}</strong> fragancias
              </span>
              <SortSelect value={sortBy} onChange={setSortBy} />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {activeFilters.length > 0 && (
            <ActiveFilters filters={activeFilters} onClearAll={resetFilters} />
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
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

          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/50 backdrop-blur-xs">
              <div className="w-4/5 max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <h2 className="font-serif text-xl font-bold text-slate-900">Filtros</h2>
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

          <div className="col-span-1 md:col-span-3">
            {loading ? (
              <div className="py-20 text-center text-slate-400">Cargando catálogo...</div>
            ) : (
              <>
                <ProductGrid
                  products={products}
                  onProductNavigate={handleProductNavigation}
                  isRestoring={navigationType === 'POP'}
                />

                {/* Sensor de Scroll Infinito */}
                {hasMore && (
                  <div
                    ref={observerTarget}
                    className="mt-10 flex h-16 w-full items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="animate-pulse text-sm text-slate-400">
                      Cargando más fragancias...
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Faq title="Preguntas frecuentes sobre la compra" items={faqItems} />
      </Container>
    </main>
  );
}