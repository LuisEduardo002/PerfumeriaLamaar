/**
 * generate-sitemap.cjs
 * Genera dist/sitemap.xml después del build de Vite.
 * - Rutas estáticas + una URL por producto (slug del nombre).
 * - El dominio se toma de VITE_SITE_URL (.env o variable de entorno del sistema).
 */
const fs = require('fs');
const path = require('path');

function readEnvValue(key) {
  try {
    const env = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
    const match = env.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

const SITE_URL = (
  process.env.VITE_SITE_URL ||
  readEnvValue('VITE_SITE_URL') ||
  'https://lammar.com'
).replace(/\/+$/, '');

const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const staticRoutes = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/catalogo', priority: '0.9', changefreq: 'daily' },
  { loc: '/privacidad', priority: '0.3', changefreq: 'yearly' },
  { loc: '/terminos', priority: '0.3', changefreq: 'yearly' },
];

const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'perfumes.js'), 'utf8');
const productNames = [...source.matchAll(/nombre:\s*"([^"]+)"/g)].map((m) => m[1]);

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
