/**
 * formatPrice.js — Función pura para formateo de precios
 *
 * Configurado para Pesos Colombianos (COP).
 */

/**
 * Formatea un número como precio en COP.
 * @param {number} price - El precio a formatear
 * @returns {string} Precio formateado (ej: "$ 150.000")
 */
export function formatPrice(price) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
