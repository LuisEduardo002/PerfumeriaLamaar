/**
 * Central site configuration — Single Source of Truth for NAP, brand and URLs
 * Used by client (import.meta.env) and Edge (hardcoded fallback)
 */
export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://lamaarperfum.store').replace(/\/+$/, '');
export const SITE_NAME = 'LAMMAR';
export const SITE_ALTERNATE_NAME = 'LAMAAR PERFUM';
export const BRAND = SITE_NAME;

export const NAP = {
  name: SITE_NAME,
  alternateName: SITE_ALTERNATE_NAME,
  url: SITE_URL,
  email: 'amazingstoresoporte@gmail.com',
  telephone: '+57 304 6420608',
  telephoneDigits: '573046420608',
  whatsapp: '573046420608',
  address: {
    streetAddress: 'Centro Comercial Los Fundadores, Local 101',
    addressLocality: 'Manizales',
    addressRegion: 'Caldas',
    postalCode: '170001',
    addressCountry: 'CO',
    full: 'Centro Comercial Los Fundadores, Local 101, Manizales, Caldas 170001, Colombia',
  },
  geo: { latitude: 5.0703, longitude: -75.5138 },
  hours: { days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:00', closes: '18:00' },
  description: 'Perfumería física y exclusiva en Manizales, Caldas (Centro Comercial Los Fundadores, Local 101) con atención presencial y más de 240 perfumes 100% originales de diseñador, árabes y nicho. Ventas en tienda física, asesoría y pedidos por WhatsApp con envíos a toda Colombia. No es tienda digital con pago online.',
};

export const SOCIAL = {
  whatsapp: 'https://wa.me/573046420608',
  instagram: 'https://www.instagram.com/lamaar_perfumm/',
  facebook: 'https://www.facebook.com/profile.php?id=61557995259913',
  tiktok: 'https://www.tiktok.com/@lamaar.perfume',
};

export const CURRENCY = 'COP';
export const PRICE_TTL_DAYS = 30;
