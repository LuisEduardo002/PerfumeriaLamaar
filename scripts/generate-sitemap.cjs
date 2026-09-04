/**
 * generate-sitemap.cjs
 * Genera dist/sitemap.xml después del build de Vite.
 * - Rutas estáticas + una URL por producto (slug del nombre).
 * - El dominio se toma de VITE_SITE_URL (.env o variable de entorno del sistema).
 */
const fs = require('fs');
const path = require('path');
const { SITE_URL } = require('./utils/site.cjs');
const { slugify } = require('./utils/slug.cjs');
const { loadPerfumes } = require('./utils/parsePerfumes.cjs');

const staticRoutes = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/catalogo', priority: '0.9', changefreq: 'daily' },
  { loc: '/about', priority: '0.7', changefreq: 'monthly' },
  { loc: '/nosotros', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contacto', priority: '0.7', changefreq: 'monthly' },
  { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { loc: '/privacidad', priority: '0.3', changefreq: 'yearly' },
  { loc: '/terminos', priority: '0.3', changefreq: 'yearly' },
];

const perfumes = loadPerfumes();
const productNames = perfumes.map(p => p.nombre);

const lastmod = new Date().toISOString().slice(0, 10);
const urls = [
  ...staticRoutes,
  ...productNames.map((name) => ({
    loc: `/producto/${slugify(name)}`,
    priority: '0.6',
    changefreq: 'weekly',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority, changefreq }) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const distDir = path.join(__dirname, '..', 'dist');
fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);

console.log(`✓ sitemap.xml generado con ${urls.length} URLs (${SITE_URL})`);
