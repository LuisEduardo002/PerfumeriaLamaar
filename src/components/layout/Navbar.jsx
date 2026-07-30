import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import Container from './Container';
import logo from '../../assets/images/logolamarbueno.svg';
import useCartStore from '../../store/useCartStore';
import CartDrawer from '../cart/CartDrawer';

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <>
    <nav className="sticky top-0 z-50 border-b border-[#C8A450]/40 bg-[#FAF9F6]/90 backdrop-blur-md">
      <Container>
        <div className="flex justify-between items-center h-24">
          {/* Logo / Brand */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <img src={logo} alt="Logo Lamar" className="h-16 md:h-24 w-auto scale-[1.5] origin-left" />
            <span className="ml-4 font-serif text-lg font-bold tracking-widest text-[#111111] md:text-xl">
              LAMMAR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#4B1E28]">
              Inicio
            </Link>
            <Link to="/catalogo" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#4B1E28]">
              Catálogo
            </Link>
            <Link to="/marcas" className="text-sm font-medium text-slate-600 transition-colors hover:text-[#4B1E28]">
              Marcas
            </Link>
          </div>

          {/* Actions (Search, Cart, Mobile Menu) */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-500 transition-colors hover:text-[#4B1E28]" aria-label="Buscar">
              <Search className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => setIsCartOpen(true)} aria-label={`Abrir carrito, ${itemCount} productos`} className="relative p-2 text-slate-500 transition-colors hover:text-[#4B1E28]">
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && <span className="absolute top-1 right-1 flex min-h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#4B1E28] px-1 text-[9px] font-bold text-white">{itemCount}</span>}
            </button>

            {/* Mobile menu button */}
            <button className="md:hidden text-slate-500 hover:text-slate-900 p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </Container>
    </nav>
    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
