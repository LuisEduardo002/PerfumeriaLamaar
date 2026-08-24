/**
 * whatsapp.js — Helper para integración con WhatsApp
 *
 * ¿Por qué un helper separado?
 * ────────────────────────────
 * La lógica de construir el mensaje de WhatsApp es LÓGICA DE NEGOCIO,
 * no lógica de interfaz. No pertenece dentro de un componente React.
 *
 * Mantenerla aquí nos da:
 * 1. Testabilidad: podemos probar la función sin renderizar React
 * 2. Reutilización: podemos usarla desde cualquier componente
 * 3. Separación de responsabilidades: el componente solo llama a la función
 *
 * NOTA: Cambia PHONE_NUMBER por tu número real antes de lanzar.
 */

import { formatPrice } from "./formatPrice";

// Obtiene el número de WhatsApp desde las variables de entorno (.env)
const PHONE_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "573001234567";

/**
 * Construye el mensaje de WhatsApp con el resumen del pedido.
 *
 * @param {Array} cartItems - Items del carrito [{ nombre, precio, quantity }]
 * @param {number} total - Total del pedido
 * @returns {string} Mensaje formateado para WhatsApp
 *
 * Ejemplo de salida:
 * Hola 👋
 *
 * Quiero realizar el siguiente pedido:
 *
 * 🧴 Asad x2
 * 🧴 Khamrah x1
 *
 * Total: $95
 *

 */
export function buildWhatsAppMessage(cartItems, total) {
  const itemLines = cartItems
    .map((item) => ` ${item.nombre} x${item.quantity}`)
    .join("\n");

  const message = `Hola 

Realicé una compra en LAMMAR Perfumes y mi pedido es:

${itemLines}

Total: ${formatPrice(total)}

`;

  return message;
}

/**
 * Abre WhatsApp (web o app) con el mensaje del pedido.
 *
 * @param {Array} cartItems - Items del carrito
 * @param {number} total - Total del pedido
 *
 * ¿Por qué usamos wa.me?
 * - wa.me es el dominio oficial de WhatsApp para deep links
 * - Funciona tanto en mobile (abre la app) como en desktop (abre WhatsApp Web)
 * - encodeURIComponent asegura que caracteres especiales (emojis, saltos de línea)
 *   no rompan la URL
 */
export function openWhatsApp(cartItems, total) {
  const message = buildWhatsAppMessage(cartItems, total);
  const url = buildWhatsAppLink(message);

  window.open(url, "_blank");
}

/**
 * Construye un enlace wa.me con cualquier mensaje.
 *
 * @param {string} message - Mensaje inicial de la conversación
 * @returns {string} URL profunda de WhatsApp
 */
export function buildWhatsAppLink(message = "Hola, quiero información sobre sus perfumes") {
  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}
