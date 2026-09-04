import { Link } from 'react-router-dom';
import Container from './Container';
import logo from '../../assets/images/picsvg_download_white.svg';

const footerLink = 'text-sm text-[#CFCFCF] transition-colors hover:text-[#C8A450]';

export default function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-[#C8A450] bg-[#111111] py-12 text-[#CFCFCF]">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Link to="/" className="mb-5 inline-block"><img src={logo} alt="Logo LAMMAR" className="h-24 w-auto" /></Link>
            <p className="max-w-xs text-sm leading-relaxed text-[#CFCFCF]">Perfumes originales y fragancias exclusivas elegidas para acompañar tu estilo.</p>
            <div className="mt-5 flex gap-4"><a href="https://www.instagram.com/lamaar_perfumm/" target="_blank" rel="noopener noreferrer" className={footerLink}>Instagram</a><a href="https://www.facebook.com/profile.php?id=61557995259913" target="_blank" rel="noopener noreferrer" className={footerLink}>Facebook</a><a href="https://www.tiktok.com/@lamaar.perfume" target="_blank" rel="noopener noreferrer" className={footerLink}>TikTok</a></div>
          </div>
          <div><p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#C8A450]">Tienda</p><ul className="space-y-3"><li><Link to="/catalogo" className={footerLink}>Todos los perfumes</Link></li><li><Link to="/about" className={footerLink}>Sobre nosotros</Link></li><li><Link to="/contact" className={footerLink}>Contacto</Link></li></ul></div>
          <div><p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#C8A450]">Compra segura</p><ul className="space-y-3 text-sm"><li><Link to="/privacy" className={footerLink}>Privacidad</Link></li><li><Link to="/terminos" className={footerLink}>Términos</Link></li><li>Productos 100% originales</li></ul></div>
          <div><p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#C8A450]">Contacto</p><ul className="space-y-3 text-sm"><li>Centro Comercial Los Fundadores, Local 101</li><li>Manizales, Caldas 170001, Colombia</li><li>amazingstoresoporte@gmail.com</li><li><a href="https://wa.me/573046420608" target="_blank" rel="noopener noreferrer" className={footerLink}>+57 304 6420608</a></li><li>Lun. a sáb., 9:00 a.m. – 6:00 p.m.</li></ul></div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#C8A450]/25 pt-7 text-center text-xs text-slate-500 md:flex-row md:text-left"><p>© {new Date().getFullYear()} LAMMAR. Todos los derechos reservados.</p><div className="space-x-4"><Link to="/about" className="hover:text-[#C8A450]">Sobre nosotros</Link><Link to="/contact" className="hover:text-[#C8A450]">Contacto</Link><Link to="/privacy" className="hover:text-[#C8A450]">Privacidad</Link><Link to="/privacidad" className="hover:text-[#C8A450]">Privacidad (ES)</Link><Link to="/terminos" className="hover:text-[#C8A450]">Términos</Link></div></div>
      </Container>
    </footer>
  );
}
