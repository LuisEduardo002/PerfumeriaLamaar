/**
 * Central site configuration — Single Source of Truth for NAP, brand and URLs
 * Used by client (import.meta.env) and Edge (hardcoded fallback)
 */
export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://lamaarperfum.store').replace(/\/+$/, '');
export const SITE_NAME = 'LAMAAR';
export const SITE_ALTERNATE_NAME = 'LAMMAR';
// Marca oficial: LAMAAR Perfumería (doble A). LAMMAR (doble M) se conserva como alternate para no perder búsquedas viejas.
export const SITE_FULL_NAME = 'LAMAAR Perfumería';
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
    streetAddress: 'KPalogrande, Av. Lindsay, Frente coliseo menor, Cl. 65 #24-89 Local Piso -1',
    addressLocality: 'Manizales',
    addressRegion: 'Caldas',
    postalCode: '170001',
    addressCountry: 'CO',
    full: 'KPalogrande, Av. Lindsay, Frente coliseo menor, Cl. 65 #24-89 Local Piso -1, Manizales, Caldas 170001, Colombia',
  },
  geo: { latitude: 5.0549, longitude: -75.4850 },
  hours: { days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:00', closes: '18:00' },
  description: 'Perfumería física y exclusiva en Manizales, Caldas (KPalogrande, Av. Lindsay, Frente coliseo menor, Cl. 65 #24-89 Local Piso -1) con atención presencial y más de 240 perfumes 100% originales de diseñador, árabes y nicho. Ventas en tienda física, asesoría y pedidos por WhatsApp con envíos a toda Colombia. No es tienda digital con pago online.',
};

export const SOCIAL = {
  whatsapp: 'https://wa.me/573046420608',
  instagram: 'https://www.instagram.com/lamaar_perfumm/',
  facebook: 'https://www.facebook.com/profile.php?id=61557995259913',
  tiktok: 'https://www.tiktok.com/@lamaar.perfume',
};

// IndexNow y servicio pH: espejo de scripts/utils/site.cjs (cliente no lee .env en build Edge).
// Si cambias la key o pasos, cámbialos en ambos archivos.
export const INDEXNOW_KEY = '6db2ccb300575995b1ab6ee52d751c3c';
export const PH_SERVICE = {
  name: 'Medición de pH para elección de perfume en Manizales',
  steps: ['Limpieza de la piel', 'Aplicación de tira reactiva', 'Lectura en 30-60 segundos', 'Recomendación entre 240+ originales'],
  cost: 'Incluida sin costo con tu visita',
  schedule: 'Lunes a sábado 9:00-18:00, presencial, sin cita',
};

export const CURRENCY = 'COP';
export const PRICE_TTL_DAYS = 30;
