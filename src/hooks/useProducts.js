import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllProducts, getCategories, getBrands } from '../services/productService';

const PAGE_SIZE = 30;
const STORAGE_KEY = 'lammar-catalog-state';

function getSavedState() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

/**
 * Custom Hook useProducts — Separa la lógica de filtrado, búsqueda y ordenamiento de la UI.
 */
export function useProducts(initialState = {}, initialData = null) {
  const saved = getSavedState();
  const mergedState = { ...saved, ...initialState };

  const [products, setProducts] = useState(initialData?.products || []);
  const [categories, setCategories] = useState(initialData?.categories || []);
  const [brands, setBrands] = useState(initialData?.brands || []);
  const [loading, setLoading] = useState(!initialData);

  // Estados de Filtros e Inicialización (priorizando sessionStorage al regresar)
  const [searchTerm, setSearchTermState] = useState(mergedState.searchTerm || '');
  const [selectedCategory, setSelectedCategoryState] = useState(mergedState.selectedCategory || '');
  const [selectedBrand, setSelectedBrandState] = useState(mergedState.selectedBrand || '');
  const [selectedGender, setSelectedGenderState] = useState(mergedState.selectedGender || '');
  const [sortBy, setSortByState] = useState(mergedState.sortBy || 'featured');
  const [visibleCount, setVisibleCount] = useState(mergedState.visibleCount || PAGE_SIZE);

  useEffect(() => {
    if (initialData) {
      setProducts(initialData.products);
      setCategories(initialData.categories);
      setBrands(initialData.brands);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([getAllProducts(), getCategories(), getBrands()]).then(
      ([allProducts, cats, bnds]) => {
        setProducts(allProducts);
        setCategories(cats);
        setBrands(bnds);
        setLoading(false);
      }
    );
  }, [initialData]);

  // Setters que reinician visibleCount SOLO ante interacción directa del usuario
  const setSearchTerm = useCallback((val) => {
    setSearchTermState(val);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const setSelectedCategory = useCallback((val) => {
    setSelectedCategoryState(val);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const setSelectedBrand = useCallback((val) => {
    setSelectedBrandState(val);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const setSelectedGender = useCallback((val) => {
    setSelectedGenderState((prev) => {
      if (prev !== val) setVisibleCount(PAGE_SIZE);
      return val;
    });
  }, []);

  const setSortBy = useCallback((val) => {
    setSortByState(val);
    setVisibleCount(PAGE_SIZE);
  }, []);

  // Lógica memorizada para filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          searchTerm === '' ||
          product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === '' ||
          product.categoria?.toLowerCase() === selectedCategory.toLowerCase();

        const matchesBrand =
          selectedBrand === '' ||
          product.marca?.toLowerCase() === selectedBrand.toLowerCase();

        const matchesGender =
          selectedGender === '' ||
          product.genero?.toLowerCase() === selectedGender.toLowerCase();

        return matchesSearch && matchesCategory && matchesBrand && matchesGender;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.precio - b.precio;
        if (sortBy === 'price-desc') return b.precio - a.precio;
        if (sortBy === 'name-asc') return a.nombre.localeCompare(b.nombre);
        return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0);
      });
  }, [products, searchTerm, selectedCategory, selectedBrand, selectedGender, sortBy]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const loadMore = useCallback(() => {
    setVisibleCount((currentCount) => currentCount + PAGE_SIZE);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTermState('');
    setSelectedCategoryState('');
    setSelectedBrandState('');
    setSelectedGenderState('');
    setSortByState('featured');
    setVisibleCount(PAGE_SIZE);
  }, []);

  return {
    products: visibleProducts,
    totalCount: filteredProducts.length,
    visibleCount: visibleProducts.length,
    hasMore: visibleProducts.length < filteredProducts.length,
    loadMore,
    allCount: products.length,
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
  };
}