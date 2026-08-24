import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation, useNavigation } from 'react-router-dom';

// Layout Components
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MobileCta from '../components/layout/MobileCta';

// Pages
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Product from '../pages/Product';
import NotFound from '../pages/NotFound';
import Privacy from '../pages/Privacy';
import Terms from '../pages/TerminosCondiciones.jsx';
import { getAllProducts, getBrands, getCategories } from '../services/productService';
import { trackPageView } from '../utils/ga4';

async function catalogLoader() {
  const [products, categories, brands] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getBrands(),
  ]);

  return { products, categories, brands };
}

function RouteLoadingState() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#FAF9F6] px-4 py-24" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center text-center">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#C8A450]/30 border-t-[#4B1E28]" aria-hidden="true" />
        <p className="mt-4 font-serif text-xl text-[#111111]">Cargando catálogo</p>
        <p className="mt-1 text-sm text-slate-500">Estamos preparando tus fragancias.</p>
      </div>
    </main>
  );
}

// Main Layout that wraps all pages with Navbar and Footer
const MainLayout = () => {
  const navigation = useNavigation();
  const location = useLocation();
  const isLoadingCatalog =
    navigation.state === 'loading' && navigation.location?.pathname === '/catalogo';

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 flex-col">
        {isLoadingCatalog ? <RouteLoadingState /> : <Outlet />}
      </div>
      <Footer />
      {/* Espaciador para que el CTA fijo no tape el footer en móvil */}
      <div className="h-[76px] md:hidden" aria-hidden="true" />
      <MobileCta />
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
        loader: catalogLoader,
      },
      {
        path: 'producto/:id',
        element: <Product />,
      },
      {
        path: 'privacidad',
        element: <Privacy />,
      },
      {
        path: 'terminos',
        element: <Terms />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} fallbackElement={<RouteLoadingState />} />;
}
