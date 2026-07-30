import { useState, useEffect, useMemo } from 'react';
import { getAllProducts, getCategories, getBrands } from '../services/productService';

/**
 * Custom Hook useProducts — Separa la lógica de filtrado, búsqueda y ordenamiento de la UI.
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllProducts(), getCategories(), getBrands()]).then(
      ([allProducts, cats, bnds]) => {
        setProducts(allProducts);
        setCategories(cats);
        setBrands(bnds);
        setLoading(false);
      }
    );
  }, []);

  // Lógica memorizada para filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Filtro por búsqueda
        const matchesSearch =
          searchTerm === '' ||
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro por categoría
        const matchesCategory =
          selectedCategory === '' ||
          product.categoria.toLowerCase() === selectedCategory.toLowerCase();

        // Filtro por marca
        const matchesBrand =
          selectedBrand === '' ||
          product.marca.toLowerCase() === selectedBrand.toLowerCase();

        // Filtro por género
        const matchesGender =
          selectedGender === '' ||
          product.genero.toLowerCase() === selectedGender.toLowerCase();

        return matchesSearch && matchesCategory && matchesBrand && matchesGender;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.precio - b.precio;
        if (sortBy === 'price-desc') return b.precio - a.precio;
        if (sortBy === 'name-asc') return a.nombre.localeCompare(b.nombre);
        // 'featured' por defecto
        return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0);
      });
  }, [products, searchTerm, selectedCategory, selectedBrand, selectedGender, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedGender('');
    setSortBy('featured');
  };

  return {
    products: filteredProducts,
    totalCount: filteredProducts.length,
    allCount: products.length,
    categories,
    brands,
    loading,
    // Estados
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedGender,
    sortBy,
    // Setters
    setSearchTerm,
    setSelectedCategory,
    setSelectedBrand,
    setSelectedGender,
    setSortBy,
    resetFilters,
  };
}
