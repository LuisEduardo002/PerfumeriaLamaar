import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const STORAGE_PREFIX = 'lammar-scroll-position:';
const LEAVING_CATALOG_KEY = 'lammar-is-leaving-catalog';

function getSavedPosition(storageKey) {
  try {
    const savedPosition = sessionStorage.getItem(storageKey);
    return savedPosition ? JSON.parse(savedPosition) : null;
  } catch {
    return null;
  }
}

/**
 * Guarda y restaura el scroll únicamente al volver con Atrás/Adelante.
 * sessionStorage mantiene la experiencia durante la sesión, sin conservar
 * posiciones antiguas entre sesiones diferentes del navegador.
 */
export default function useScrollRestoration({ isReady = true, pageId }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const frameId = useRef(null);
  const storageKey = `${STORAGE_PREFIX}${pageId || `${location.pathname}${location.search}`}`;

  useEffect(() => {
    const savePosition = () => {
      // La animación de salida aún puede recibir el scroll-to-top de la nueva
      // ruta; no permitimos que ese 0 reemplace la posición real guardada.
      if (sessionStorage.getItem(LEAVING_CATALOG_KEY) === 'true') return;

      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({ x: window.scrollX, y: window.scrollY })
        );
      } catch {
        // Si el navegador bloquea sessionStorage, la navegación sigue funcionando.
      }
    };

    const handleScroll = () => {
      if (frameId.current) return;

      frameId.current = requestAnimationFrame(() => {
        savePosition();
        frameId.current = null;
      });
    };

    savePosition();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      savePosition();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [storageKey]);

  // useLayoutEffect ejecuta antes de pintar la lista cargada: evita el salto visual.
  useLayoutEffect(() => {
    if (!isReady) return;

    if (navigationType === 'POP') {
      const position = getSavedPosition(storageKey);
      if (position) window.scrollTo(position.x, position.y);
    }

    sessionStorage.removeItem(LEAVING_CATALOG_KEY);
  }, [isReady, navigationType, storageKey]);
}
