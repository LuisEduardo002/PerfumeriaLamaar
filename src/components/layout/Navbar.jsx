import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, X } from 'lucide-react';
import Container from './Container';
import logo from '../../assets/images/lammar-logo-256.png';

import useCartStore from '../../store/useCartStore';
import CartDrawer from '../cart/CartDrawer';

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navSearchTerm, setNavSearchTerm] = useState('');
  const itemCount = useCartStore((state) => state.getItemCount());
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setNavSearchTerm('');
  };

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearchTerm.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(navSearchTerm.trim())}`);
      closeSearch();
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[#C8A450]/40 bg-[#FAF9F6]/90 backdrop-blur-md">
        <Container>
          <div className="relative flex h-20 md:h-24 items-center">

            {/* ========== MODO NORMAL ========== */}
            <div
              className={`flex w-full items-center justify-between transition-all duration-300 ${isSearchOpen
                ? 'pointer-events-none opacity-0 scale-95'
                : 'opacity-100 scale-100'
                }`}
            >
              {/* Logo + Inicio */}
              <Link to="/" className="flex-shrink-0 flex items-center gap-3">
                <img
                  src={logo}
                  alt="LAMMAR - Perfumería exclusiva"
                  className="h-12 md:h-16 w-auto object-contain"
                />
                <span className="font-serif text-lg md:text-xl font-semibold uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-[#4B1E28]">
                  Inicio
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8 items-center">
                <Link
                  to="/"
                  className="font-sans text-sm font-light tracking-wide text-slate-600 transition-colors hover:text-[#4B1E28]"
                >
                  Inicio
                </Link>
                <Link
                  to="/catalogo"
                  className="font-sans text-sm font-light tracking-wide text-slate-600 transition-colors hover:text-[#4B1E28]"
                >
                  Catálogo
                </Link>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 text-slate-500 transition-colors hover:text-[#4B1E28]"
                  aria-label="Buscar"
                >
                  <Search className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Abrir carrito"
                  className="relative p-2.5 text-slate-500 transition-colors hover:text-[#4B1E28]"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#4B1E28] px-1 text-[10px] font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* ========== MODO BÚSQUEDA ========== */}
            <div
              className={`absolute inset-0 flex items-center transition-all duration-300 ${isSearchOpen
                ? 'opacity-100 scale-100'
                : 'pointer-events-none opacity-0 scale-95'
                }`}
            >
              <form
                onSubmit={handleNavSearch}
                className="flex w-full items-center gap-3"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar fragancia, marca..."
                    value={navSearchTerm}
                    onChange={(e) => setNavSearchTerm(e.target.value)}
                    className="h-12 w-full rounded-full border border-stone-300 bg-white pl-12 pr-4 font-sans text-base text-slate-800 placeholder:text-slate-400 shadow-sm transition focus:border-[#4B1E28] focus:outline-none focus:ring-2 focus:ring-[#4B1E28]/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={closeSearch}
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-stone-100 text-slate-500 transition hover:bg-stone-200 hover:text-slate-700"
                  aria-label="Cerrar búsqueda"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </Container>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}