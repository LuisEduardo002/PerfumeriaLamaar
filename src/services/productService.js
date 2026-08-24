/**
 * productService.js — Service Layer (Capa de Servicio)
 *
 * ¿Por qué existe este archivo?
 * ─────────────────────────────
 * Este es uno de los patrones más importantes en arquitectura frontend
 * profesional: el SERVICE LAYER.
 *
 * PROBLEMA: Si tus componentes importan directamente `data/perfumes.js`,
 * cuando migres a Firebase/Supabase/API REST tendrías que buscar y
 * cambiar CADA componente que usa esos datos.
 *
 * SOLUCIÓN: Los componentes y hooks nunca tocan la fuente de datos
 * directamente. Siempre pasan por este servicio. Si mañana cambias
 * de archivo local a API, solo tocas ESTE archivo.
 *
 * Hoy:    productService.js → import desde perfumes.js (local)
 * Mañana: productService.js → fetch('https://api.lammar.com/products')
 *
 * Los componentes no se enteran del cambio.
 *
 * NOTA: Las funciones retornan Promises para simular el
 * comportamiento asíncrono de una API real. Esto hace que
 * la migración futura sea transparente.
 */

import { perfumes } from "../data/perfumes";
import slugify from "../utils/slug";

/**
 * Obtiene todos los productos.
 * @returns {Promise<Array>} Lista completa de perfumes
 */
export function getAllProducts() {
  return Promise.resolve(perfumes);
}

/**
 * Busca un producto por su slug de URL o por su ID numérico (compatibilidad).
 * @param {string|number} idOrSlug - Slug del producto ("al-noble-ameer") o ID legacy
 * @returns {Promise<Object|undefined>} El producto encontrado o undefined
 */
export function getProductById(idOrSlug) {
  const raw = String(idOrSlug);
  const byLegacyId = perfumes.find((p) => String(p.id) === raw);
  if (byLegacyId) return Promise.resolve(byLegacyId);
  const product = perfumes.find((p) => slugify(p.nombre) === raw);
  return Promise.resolve(product);
}

/**
 * Genera la URL amigable de un producto a partir de su nombre.
 * @param {Object} product - Producto
 * @returns {string} Slug limpio, sin números de ID ni conectores extraños
 */
export function getProductUrl(product) {
  return `/producto/${slugify(product.nombre)}`;
}

/**
 * Obtiene productos filtrados por categoría.
 * @param {string} category - Nombre de la categoría
 * @returns {Promise<Array>} Productos de esa categoría
 */
export function getProductsByCategory(category) {
  const filtered = perfumes.filter(
    (p) => p.categoria.toLowerCase() === category.toLowerCase()
  );
  return Promise.resolve(filtered);
}

/**
 * Obtiene productos filtrados por marca.
 * @param {string} brand - Nombre de la marca
 * @returns {Promise<Array>} Productos de esa marca
 */
export function getProductsByBrand(brand) {
  const filtered = perfumes.filter(
    (p) => p.marca.toLowerCase() === brand.toLowerCase()
  );
  return Promise.resolve(filtered);
}

/**
 * Obtiene los productos destacados (para el Home).
 * @returns {Promise<Array>} Productos marcados como destacados
 */
export function getFeaturedProducts() {
  const featured = perfumes.filter((p) => p.destacado);
  return Promise.resolve(featured);
}

/**
 * Obtiene la lista única de marcas disponibles.
 * @returns {Promise<string[]>} Array de nombres de marca
 */
export function getBrands() {
  const brands = [...new Set(perfumes.map((p) => p.marca))];
  return Promise.resolve(brands);
}

/**
 * Obtiene la lista única de categorías disponibles.
 * @returns {Promise<string[]>} Array de nombres de categoría
 */
export function getCategories() {
  const categories = [...new Set(perfumes.map((p) => p.categoria))];
  return Promise.resolve(categories);
}
