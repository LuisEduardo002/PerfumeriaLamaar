import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import Price from '../components/common/Price';
import ProductGrid from '../components/product/ProductGrid';
import { getAllProducts, getProductById } from '../services/productService';
import useCartStore from '../store/useCartStore';
import useSEO from '../hooks/useSEO';
import Faq from '../components/common/Faq';
import ShareButton from '../components/common/ShareButton';
import { faqItems } from '../data/faq';

const noteGroups = [
  { key: 'salida', label: 'Salida' },
  { key: 'corazon', label: 'Corazón' },
  { key: 'fondo', label: 'Fondo' },
];

export default function Product() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Todas las entradas de detalle comienzan en la fotografía principal.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      const currentProduct = await getProductById(id);
      const allProducts = currentProduct ? await getAllProducts() : [];

      if (!active) return;

      setProduct(currentProduct);
      setRelatedProducts(
        allProducts
          .filter(
            (item) =>
              item.id !== currentProduct?.id &&
              item.categoria === currentProduct?.categoria
          )
          .slice(0, 4)
      );
      setQuantity(1);
      setSelectedImage(0);
      setLoading(false);
    }

    loadProduct();
    return () => {
      active = false;
    };
  }, [id]);

  const images = useMemo(() => {
    if (!product) return [];
    return product.imagenes?.length ? product.imagenes : [product.imagen];
  }, [product]);

  useSEO({
    title: product ? `${product.nombre} de ${product.marca} – Perfume Original` : 'Perfumes Originales',
    description: product
      ? `Compra ${product.nombre} de ${product.marca}, perfume original de ${product.ml} ml. ${product.descripcion}`.slice(0, 160)
      : 'Descubre perfumes originales de diseñador y nicho en LAMMAR.',
  });

  if (loading) {
    return <main className="flex-grow py-20 text-center text-slate-500">Cargando fragancia...</main>;
  }

  if (!product) {
    return (
      <main className="flex-grow py-20">
        <Container className="text-center">
          <h1 className="font-serif text-3xl text-slate-900">Fragancia no encontrada</h1>
          <Link to="/catalogo" className="mt-4 inline-block text-sm text-rose-700 hover:underline">
            Ver catálogo
          </Link>
        </Container>
      </main>
    );
  }

  const isAvailable = product.stock > 0;
  const changeQuantity = (change) => {
    setQuantity((current) => Math.min(product.stock, Math.max(1, current + change)));
  };

  const handleBackToCatalog = () => {
    // Volvemos a la entrada original para que React Router restaure el scroll.
    if (location.state?.fromCatalog) {
      navigate(-1);
      return;
    }

    navigate('/catalogo');
  };

  return (
    <main className="flex-grow bg-[#FAF9F6] py-8 md:py-14">
      <Container>
        <button type="button" onClick={handleBackToCatalog} className="mb-8 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-950">
          <ChevronLeft className="h-4 w-4" /> Volver al catálogo
        </button>

        <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-square overflow-hidden rounded-3xl border border-stone-200 bg-white">
              <img
                src={images[selectedImage]}
                alt={`Perfume ${product.nombre} de ${product.marca}`}
                className="h-full w-full object-contain p-8"
                onError={(event) => { event.currentTarget.style.display = 'none'; }}
              />
              <div className="flex h-full items-center justify-center font-serif text-3xl text-stone-300">
                {product.marca}
              </div>
            </motion.div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((image, index) => (
                  <button key={image} type="button" onClick={() => setSelectedImage(index)} aria-label={`Ver imagen ${index + 1} de ${product.nombre}`} className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${selectedImage === index ? 'border-[#C8A450]' : 'border-transparent'}`}>
                    <img src={image} alt={`${product.nombre} - vista ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4B1E28]">{product.marca}</p>
            <h1 className="mt-3 font-serif text-4xl text-[#111111] md:text-5xl">{product.nombre}</h1>
            <p className="mt-4 text-sm uppercase tracking-wider text-slate-500">{product.genero} · {product.ml} ml</p>
            <div className="mt-6"><Price value={product.precio} size="lg" /></div>
            <p className="mt-7 leading-7 text-slate-600">{product.descripcion}</p>

            <div className="mt-8 border-y border-stone-200 py-6">
              <h2 className="font-serif text-xl text-[#111111]">Notas olfativas</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {noteGroups.map(({ key, label }) => (
                  <div key={key} className="rounded-xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#4B1E28]">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{product.notas?.[key]?.join(', ') || '—'}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className={`mt-6 flex items-center gap-2 text-sm ${isAvailable ? 'text-emerald-700' : 'text-[#4B1E28]'}`}>
              <Check className="h-4 w-4" /> {isAvailable ? `${product.stock} unidades disponibles` : 'Agotado temporalmente'}
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <div className="flex w-fit items-center rounded-full border border-stone-300 bg-white">
                <button type="button" onClick={() => changeQuantity(-1)} disabled={quantity === 1} aria-label="Reducir cantidad" className="p-3 disabled:text-slate-300"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button type="button" onClick={() => changeQuantity(1)} disabled={quantity >= product.stock} aria-label="Aumentar cantidad" className="p-3 disabled:text-slate-300"><Plus className="h-4 w-4" /></button>
              </div>
              <Button disabled={!isAvailable} onClick={() => { addToCart(product, quantity); toast.success(`${product.nombre} fue agregado al carrito`); }} className="gap-2 sm:flex-1">
                <ShoppingBag className="h-4 w-4" /> {isAvailable ? 'Agregar al carrito' : 'Producto agotado'}
              </Button>
            </div>
            <ShareButton
              title={`${product.nombre} de ${product.marca}`}
              text={`Mira este perfume original: ${product.nombre} de ${product.marca} en LAMMAR`}
              className="mt-3 w-full sm:w-auto"
            />
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-stone-200 pt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4B1E28]">También te puede interesar</p>
            <h2 className="mt-2 font-serif text-3xl text-[#111111]">Fragancias relacionadas</h2>
            <div className="mt-8"><ProductGrid products={relatedProducts} /></div>
          </section>
        )}

        <Faq title="Preguntas frecuentes sobre la compra" items={faqItems} />
      </Container>
    </main>
  );
}
