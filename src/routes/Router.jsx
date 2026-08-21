import { createBrowserRouter, RouterProvider, Outlet, useNavigation } from 'react-router-dom';

// Layout Components
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Pages
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Product from '../pages/Product';
import NotFound from '../pages/NotFound';
import Privacy from '../pages/Privacy';
import Terms from '../pages/TerminosCondiciones.jsx';
import { getAllProducts, getBrands, getCategories } from '../services/productService';

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
  const isLoadingCatalog =
    navigation.state === 'loading' && navigation.location?.pathname === '/catalogo';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 flex-col">
        {isLoadingCatalog ? <RouteLoadingState /> : <Outlet />}
      </div>
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
