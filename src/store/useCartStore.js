/**
 * useCartStore.js — Estado global del carrito con Zustand
 *
 * ¿Por qué Zustand y no Context API?
 * ───────────────────────────────────
 * Context API provoca re-renders en TODOS los componentes que
 * consumen el contexto cuando cualquier valor cambia.
 *
 * Zustand:
 * - Solo re-renderiza los componentes que usan el slice que cambió
 * - API mínima: no necesitas Provider, ni Reducer, ni Actions
 * - Persistencia con localStorage incluida como middleware
 * - ~1KB de tamaño
 *
 * ¿Por qué persist()?
 * ────────────────────
 * El carrito se guarda automáticamente en localStorage.
 * Si el usuario cierra el navegador y vuelve, su carrito sigue ahí.
 * Esto es estándar en cualquier e-commerce profesional.
 *
 * Estructura del state:
 * {
 *   items: [
 *     { ...productData, quantity: 2 },
 *     { ...productData, quantity: 1 },
 *   ]
 * }
 *
 * Nota: Guardamos el producto completo (no solo el ID) para evitar
 * tener que buscar los datos del producto cada vez que renderizamos
 * el carrito. Esto es un trade-off aceptable porque:
 * 1. Los datos de productos son pequeños (< 1KB cada uno)
 * 2. Evitamos lookups innecesarios al Service Layer
 * 3. El carrito típicamente tiene pocos items (< 10)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { perfumes } from "../data/perfumes";

const useCartStore = create(
  persist(
    (set, get) => ({
      // ───── State ─────
      items: [],

      // ───── Actions ─────

      /**
       * Agrega un producto al carrito.
       * Si ya existe, incrementa la cantidad.
       * Si no existe, lo agrega con quantity: 1.
       */
      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            // Producto ya existe → incrementar cantidad
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: Math.min(item.stock, item.quantity + quantity) }
                  : item
              ),
            };
          }

          // Producto nuevo → agregar con quantity: 1
          return {
            items: [...state.items, { ...product, quantity: Math.min(product.stock, quantity) }],
          };
        }),

      /**
       * Elimina un producto completamente del carrito.
       */
      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      /**
       * Incrementa la cantidad de un producto en 1.
       */
      increaseQuantity: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.min(item.stock, item.quantity + 1) }
              : item
          ),
        })),

      /**
       * Decrementa la cantidad de un producto en 1.
       * Si llega a 0, lo elimina del carrito.
       */
      decreaseQuantity: (productId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      /**
       * Vacía completamente el carrito.
       */
      clearCart: () => set({ items: [] }),

      // ───── Selectors (Computados) ─────
      // Nota: En Zustand, los "selectors" derivados se hacen con get()
      // dentro de funciones, no como propiedades del state.

      /**
       * Calcula el total del carrito.
       * @returns {number} Suma de (precio × cantidad) de todos los items
       */
      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.precio * item.quantity,
          0
        );
      },

      /**
       * Calcula la cantidad total de items en el carrito.
       * @returns {number} Suma de todas las cantidades
       */
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      // Configuración del middleware persist
      name: "lammar-cart", // Key en localStorage
      version: 2,
      migrate: (persistedState) => ({
        ...persistedState,
        // Refresca los carritos guardados con las fotos y datos actuales.
        items: (persistedState?.items || []).map((item) => {
          const currentProduct = perfumes.find((product) => product.id === item.id);

          if (!currentProduct) return item;

          return {
            ...currentProduct,
            quantity: Math.min(item.quantity, currentProduct.stock),
          };
        }),
      }),
    }
  )
);

export default useCartStore;
