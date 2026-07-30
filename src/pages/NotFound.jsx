import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';

export default function NotFound() {
  return (
    <main className="flex-grow flex items-center justify-center py-20">
      <Container className="text-center">
        <h1 className="text-9xl font-bold text-slate-200">404</h1>
        <h2 className="text-3xl font-serif font-bold text-slate-900 mt-4">Página no encontrada</h2>
        <p className="text-slate-500 mt-2 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors"
        >
          Volver al Inicio
        </Link>
      </Container>
    </main>
  );
}
