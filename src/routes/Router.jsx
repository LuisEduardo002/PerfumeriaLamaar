import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';

// Layout Components
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Pages
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Product from '../pages/Product';
import NotFound from '../pages/NotFound';
import { getAllProducts, getBrands, getCategories } from '../services/productService';

async function catalogLoader() {
  const [products, categories, brands] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getBrands(),
  ]);

  return { products, categories, brands };
}

// Main Layout that wraps all pages with Navbar and Footer
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ScrollRestoration getKey={(location) => location.key} />
      <div className="flex flex-1 flex-col">
        <Outlet />
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
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
