import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function FeaturedProductsCarousel({ products = [], loading = false }) {
  const previousButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="group/carousel relative px-2 sm:px-12">
      {/* Botón Izquierdo */}
      <button
        ref={previousButtonRef}
        type="button"
        aria-label="Ver fragancias anteriores"
        className="absolute -left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#C8A450]/50 bg-[#FAF9F6] text-[#4B1E28] shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#4B1E28] hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-30 sm:left-1 sm:h-11 sm:w-11"
      >
        <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
      </button>

      {/* Botón Derecho */}
      <button
        ref={nextButtonRef}
        type="button"
        aria-label="Ver más fragancias"
        className="absolute -right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#C8A450]/50 bg-[#FAF9F6] text-[#4B1E28] shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#4B1E28] hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-30 sm:right-1 sm:h-11 sm:w-11"
      >
        <ChevronRight className="h-5 w-5 stroke-[2.5]" />
      </button>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1.12}
        navigation={{
          prevEl: previousButtonRef.current,
          nextEl: nextButtonRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = previousButtonRef.current;
          swiper.params.navigation.nextEl = nextButtonRef.current;
        }}
        onInit={(swiper) => {
          // Fuerza la re-vinculación de la navegación cuando el DOM de los botones ya existe
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        className="!overflow-hidden sm:!overflow-visible py-4"
      >
        {products.map((perfume) => (
          <SwiperSlide key={perfume.id || perfume._id} className="!h-auto">
            <ProductCard perfume={perfume} />
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="mt-4 text-center text-xs text-slate-400 sm:hidden">
        Desliza para ver más fragancias
      </p>
    </div>
  );
}