import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '../components/layout/Container';
import SectionTitle from '../components/common/SectionTitle';
import FeaturedProductsCarousel from '../components/product/FeaturedProductsCarousel';
import Button from '../components/common/Button';
import { getFeaturedProducts } from '../services/productService';
import useSEO from '../hooks/useSEO';
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import bannerImg from "../assets/images/lammar-banner-perfumes.jpeg";
import caballeroImage from '../assets/images/Asad.webp';
import damaImage from '../assets/images/Yara.webp';

export default function Home() {
  useSEO({
    title: 'LAMMAR | Perfumería Exclusiva y Fragancias de Diseñador',
    description:
      'Descubre la colección de perfumes exclusivos y fragancias de diseñador y nicho en LAMMAR. Encuentra tu esencia ideal y ordena directamente por WhatsApp.',
  });
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    getFeaturedProducts().then(setFeaturedProducts).finally(() => setLoadingProducts(false));
  }, []);

  return (
    <main className="flex-grow">
      {/* Hero Section con Imagen de Fondo y Altura Reducida en Móvil */}
      <section
        className="relative overflow-hidden py-16 md:py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bannerImg})` }} // <-- Reemplaza con tu ruta
      >
        {/* Superposición opcional para mejorar contraste si la imagen es muy clara */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6F0E3]/80 to-[#FAF9F6]/90 z-0" />

        <Container className="relative z-10"> {/* z-10 para estar sobre el fondo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 md:space-y-6 text-center md:text-left" // Centrado en móvil
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-[#4B1E28] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                <Sparkles className="w-3 h-3" /> Colección Exclusiva 2026
              </div>

              {/* Título un poco más pequeño en móvil */}
              <h1 className="text-3xl font-serif font-bold leading-tight text-[#111111] md:text-6xl">
                Encuentra la esencia que te define
              </h1>

              {/* Descripción oculta en móvil ('hidden md:block') */}
              <p className="hidden md:block text-lg text-slate-600 font-light leading-relaxed">
                Descubre nuestra curaduría de perfumes de diseñador y fragancias nicho. La máxima expresión de lujo y personalidad a un clic.
              </p>

              <div className="flex flex-wrap gap-4 pt-1 md:pt-2 justify-center md:justify-start"> {/* Botón centrado en móvil */}
                <Link to="/catalogo">
                  <Button variant="primary" size="lg" className="flex items-center gap-2 text-sm md:text-base">
                    Explorar Catálogo <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Visual Card Decorativa Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden md:flex justify-center"
            >
              <div className="relative flex h-96 w-80 flex-col justify-between rounded-3xl border border-[#C8A450]/40 bg-gradient-to-br from-[#F6F0E3]/90 to-white/90 p-8 shadow-2xl backdrop-blur-sm"> {/* Un poco transparente para ver el fondo */}
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">LAMMAR Essential</span>
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#111111]">Fragancias Nicho</h2>
                  <p className="text-sm text-slate-500 mt-2">Aromas únicos importados directamente para ti.</p>
                </div>
                <div className="pt-4 border-t border-slate-200/50 flex justify-between items-center text-xs text-slate-600">
                  <span>100% Originales</span>
                  <span className="font-semibold text-[#4B1E28]">Envío Garantizado</span>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="bg-[#111111] py-14 md:py-20">
        <Container>
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C8A450]">Encuentra tu esencia</p>
            <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">Elige tu colección</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Link to="/catalogo?genero=Masculino" className="group relative isolate min-h-64 overflow-hidden rounded-3xl border border-[#C8A450]/50 md:min-h-80">
              <img src={caballeroImage} alt="Colección de perfumes para caballero" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/95 via-[#111111]/55 to-transparent" />
              <div className="relative flex h-full min-h-64 flex-col justify-end p-7 md:min-h-80 md:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C8A450]">Colección</p>
                <h3 className="mt-2 font-serif text-4xl text-white">Caballero</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm text-[#FAF9F6] transition group-hover:text-[#C8A450]">Explorar fragancias <ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
            <Link to="/catalogo?genero=Femenino" className="group relative isolate min-h-64 overflow-hidden rounded-3xl border border-[#C8A450]/50 md:min-h-80">
              <img src={damaImage} alt="Colección de perfumes para dama" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#4B1E28]/95 via-[#4B1E28]/60 to-transparent" />
              <div className="relative flex h-full min-h-64 flex-col justify-end p-7 md:min-h-80 md:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C8A450]">Colección</p>
                <h3 className="mt-2 font-serif text-4xl text-white">Dama</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm text-[#FAF9F6] transition group-hover:text-[#C8A450]">Explorar fragancias <ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
          </div>
        </Container>
      </section>




      {/* Featured Products Section */}
      <section className="bg-[#FAF9F6] py-20">
        <Container>
          <SectionTitle
            title="Fragancias Destacadas"
            subtitle="Las opciones más cotizadas y queridas por nuestros clientes."
            centered
          />
          <FeaturedProductsCarousel products={featuredProducts} loading={loadingProducts} />

          <div className="text-center mt-12">
            <Link to="/catalogo">
              <Button variant="outline" size="md">
                Ver todos los perfumes ({featuredProducts.length * 3}+)
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="rounded-2xl bg-[#F6F0E3] p-3 text-[#4B1E28]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111]">100% Originales</h3>
                <p className="text-xs text-slate-500 mt-1">Garantía directa de autenticidad en cada fragancia.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="rounded-2xl bg-[#F6F0E3] p-3 text-[#4B1E28]">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111]">Envíos Nacionales</h3>
                <p className="text-xs text-slate-500 mt-1">Despachos rápidos a toda Colombia con seguimiento.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="rounded-2xl bg-[#F6F0E3] p-3 text-[#4B1E28]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111]">Asesoría Personalizada</h3>
                <p className="text-xs text-slate-500 mt-1">Te ayudamos a encontrar tu perfume ideal por WhatsApp.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
