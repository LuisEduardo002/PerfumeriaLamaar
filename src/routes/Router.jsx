import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Layout Components
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Pages
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Product from '../pages/Product';
import NotFound from '../pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return undefined;

    const previousMode = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previousMode;
    };
  }, []);

  useEffect(() => {
    // Capturamos la posición antes de desplazar la ruta nueva al inicio.
    // Esto es necesario porque AnimatePresence conserva la vista saliente
    // durante su animación y podría guardar posteriormente un valor 0.
    if (previousPathname.current === '/catalogo' && pathname !== '/catalogo') {
      sessionStorage.setItem(
        'lammar-scroll-position:catalogo',
        JSON.stringify({ x: window.scrollX, y: window.scrollY })
      );
      sessionStorage.setItem('lammar-is-leaving-catalog', 'true');
    }

    // Atrás/Adelante delega la posición al hook de cada página.
    if (navigationType !== 'POP') window.scrollTo(0, 0);

    previousPathname.current = pathname;
  }, [pathname, navigationType]);

  return null;
}

// Main Layout that wraps all pages with Navbar and Footer
const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex flex-1 flex-col"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'catalogo',
        element: <Catalog />,
      },
      {
        path: 'producto/:id',
        element: <Product />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
