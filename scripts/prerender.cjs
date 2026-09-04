/**
 * prerender.cjs
 * SSG para productos y catálogo - genera HTML estático con precio visible sin JS
 * Se ejecuta después de vite build, leyendo dist/index.html como plantilla base
 */
const fs = require('fs');
const path = require('path');

const { SITE_URL } = require('./utils/site.cjs');
const { slugify } = require('./utils/slug.cjs');
const { formatPriceCOP } = require('./utils/formatPrice.cjs');

const perfumesSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'perfumes.js'), 'utf8');

// Parse imports for image mapping: import img_xxx from '../assets/images/...'
const importMap = {};
const importRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
let im;
while ((im = importRegex.exec(perfumesSource)) !== null) {
  const [, varName, importPath] = im;
  // Convert import path to public URL: ../assets/images/X.webp -> /assets/images/X.webp or keep as is for build we need actual built asset name?
  // For prerender, we use /images/og-image.jpg as fallback or try to map to built asset via dist/assets
  // Simpler: keep original import path but convert to /src/assets/... - not ideal.
  // We'll use /images/og-image.jpg as fallback and also try to find built file that matches original name
  importMap[varName] = importPath;
}

function parsePerfumes(source) {
  const perfumes = [];
  const productRegex = /\{\s*id:\s*(\d+),\s*nombre:\s*"([^"]+)",\s*marca:\s*"([^"]+)",\s*precio:\s*(\d+),\s*categoria:\s*"([^"]+)",\s*genero:\s*"([^"]+)",\s*ml:\s*(\d+),\s*stock:\s*(\d+),\s*descripcion:\s*"([^"]+)"[\s\S]*?imagen:\s*(\w+)(?:,[\s\S]*?imagenes:\s*\[([^\]]*)\])?/g;
  let m;
  while ((m = productRegex.exec(source)) !== null) {
    const [, id, nombre, marca, precio, categoria, genero, ml, stock, descripcion, imagenVar, imagenesRaw] = m;
    const blockStart = m.index;
    const blockEnd = source.indexOf('},', blockStart) + 2;
    const block = source.slice(blockStart, blockEnd + 800);
    const notasMatch = block.match(/notas:\s*\{\s*salida:\s*\[([^\]]*)\],\s*corazon:\s*\[([^\]]*)\],\s*fondo:\s*\[([^\]]*)\]/);
    let notas = { salida: [], corazon: [], fondo: [] };
    if (notasMatch) {
      const parseList = (s) => [...s.matchAll(/"([^"]+)"/g)].map(x => x[1]);
      notas = { salida: parseList(notasMatch[1]), corazon: parseList(notasMatch[2]), fondo: parseList(notasMatch[3]) };
    }
    // Try to resolve image URL: find built asset that contains original file name
    let imageUrl = `${SITE_URL}/images/og-image.jpg`;
    const importPath = importMap[imagenVar];
    if (importPath) {
      const fileName = path.basename(importPath);
      const baseName = fileName.replace(/\.(webp|jpg|jpeg|png)$/, '');
      // Look for built file in dist/assets that contains baseName
      try {
        const assetsDir = path.join(__dirname, '..', 'dist', 'assets');
        if (fs.existsSync(assetsDir)) {
          const files = fs.readdirSync(assetsDir);
          const match = files.find(f => f.includes(baseName) || f.toLowerCase().includes(baseName.toLowerCase().slice(0, 8)));
          if (match) imageUrl = `${SITE_URL}/assets/${match}`;
          else imageUrl = `${SITE_URL}/images/og-image.jpg`;
        }
      } catch {}
    }
    // Additional images - not needed for SEO, use same
    perfumes.push({
      id: Number(id),
      nombre, marca, precio: Number(precio), categoria, genero, ml: Number(ml), stock: Number(stock), descripcion,
      notas, slug: slugify(nombre), imageUrl, sku: `LAMMAR-${id}`,
    });
  }
  return perfumes;
}

const perfumes = parsePerfumes(perfumesSource);
console.log(`Parsed ${perfumes.length} products for prerender`);

// Read dist/index.html template to extract assets
const distDir = path.join(__dirname, '..', 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');
let template = '';
try { template = fs.readFileSync(indexHtmlPath, 'utf8'); } catch { console.error('dist/index.html not found, run vite build first'); process.exit(1); }

// Extract CSS and JS assets from template
const cssMatch = template.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
const jsMatch = template.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/);
const cssTag = cssMatch ? `<link rel="stylesheet" crossorigin href="${cssMatch[1]}">` : '';
const jsTag = jsMatch ? `<script type="module" crossorigin src="${jsMatch[1]}"></script>` : '<script type="module" src="/src/main.jsx"></script>';

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Generate product pages
for (const p of perfumes) {
  const slug = p.slug;
  const url = `${SITE_URL}/producto/${slug}`;
  const title = `${p.nombre} ${p.ml}ml Original | LAMMAR Perfumería`;
  const desc = `Compra ${p.nombre} ${p.ml}ml original en LAMMAR Perfumería. ${p.descripcion.slice(0, 110)} Precio ${formatPriceCOP(p.precio)} COP, envío nacional y atención por WhatsApp.`;
  const availability = p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  const availabilityText = p.stock > 0 ? `${p.stock} unidades disponibles` : 'Agotado temporalmente';
  const priceVisible = formatPriceCOP(p.precio);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": p.nombre,
    "image": [p.imageUrl],
    "description": p.descripcion,
    "sku": p.sku,
    "mpn": p.sku,
    "brand": { "@type": "Brand", "name": p.marca },
    "category": p.categoria,
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "COP",
      "price": p.precio.toString(),
      "availability": availability,
      "itemCondition": "https://schema.org/NewCondition",
      "priceValidUntil": new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0,10),
      "seller": { "@type": "Organization", "name": "LAMMAR", "url": SITE_URL }
    },
    "aggregateRating": p.stock > 0 ? undefined : undefined
  };
  // Remove undefined
  const jsonLdStr = JSON.stringify(jsonLd, null, 2);

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}" />
<meta name="keywords" content="${escapeHtml(p.nombre)}, ${escapeHtml(p.marca)}, perfumes, fragancias, ${escapeHtml(p.categoria)}, ${escapeHtml(p.genero)}, ${p.ml}ml, comprar perfumes, LAMMAR" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="product" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(desc)}" />
<meta property="og:image" content="${p.imageUrl}" />
<meta property="og:url" content="${url}" />
<meta property="og:site_name" content="LAMMAR" />
<meta property="product:price:amount" content="${p.precio}" />
<meta property="product:price:currency" content="COP" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(desc)}" />
<meta name="twitter:image" content="${p.imageUrl}" />
<meta property="og:availability" content="${p.stock>0?'instock':'out of stock'}" />
<script type="application/ld+json">
${jsonLdStr}
</script>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
${cssTag}
</head>
<body>
<div id="root">
<header style="padding:24px;text-align:center;font-family:Montserrat,sans-serif">
<p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#C8A450;font-weight:600">LAMMAR — Manizales, Colombia</p>
<nav style="margin-top:8px"><a href="/" style="color:#4B1E28">Inicio</a> · <a href="/catalogo" style="color:#4B1E28">Catálogo</a> · <a href="/producto/${slug}" style="color:#4B1E28">${escapeHtml(p.nombre)}</a></nav>
</header>
<main style="max-width:1000px;margin:0 auto;padding:0 24px 32px;font-family:Montserrat,sans-serif;color:#334155;line-height:1.7">
<article itemscope itemtype="https://schema.org/Product">
<h1 style="font-family:'Playfair Display',serif;font-size:32px;color:#111;margin:12px 0" itemprop="name">${escapeHtml(p.nombre)} ${p.ml}ml Original | LAMMAR</h1>
<p style="color:#4B1E28;font-weight:600;text-transform:uppercase;letter-spacing:.1em;font-size:12px" itemprop="brand" itemscope itemtype="https://schema.org/Brand"><span itemprop="name">${escapeHtml(p.marca)}</span> · ${escapeHtml(p.categoria)} · ${escapeHtml(p.genero)} · ${p.ml} ml</p>
<div style="margin:16px 0;display:flex;gap:16px;align-items:center">
<img src="${p.imageUrl}" alt="${escapeHtml(p.nombre)} de ${escapeHtml(p.marca)} - perfume original ${p.ml}ml" style="width:320px;height:320px;object-fit:contain;border:1px solid #e5e5e5;border-radius:16px;background:#fff;padding:16px" itemprop="image" loading="eager" />
<div>
<div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
<link itemprop="url" href="${url}" />
<meta itemprop="priceCurrency" content="COP" />
<meta itemprop="availability" content="${availability}" />
<p style="font-size:28px;font-weight:700;color:#111;margin:8px 0" itemprop="price" content="${p.precio}">${priceVisible} <span style="font-size:14px;font-weight:400;color:#64748b">COP</span></p>
<p style="font-size:12px;color:#64748b">SKU: <span itemprop="sku">${p.sku}</span> · Estado: <span>${p.stock>0?'Nuevo':'Agotado'}</span></p>
<p style="font-size:14px;color:${p.stock>0?'#0f766e':'#9f1239'};font-weight:600">${availabilityText}</p>
<p style="font-size:13px;color:#475569;margin-top:8px">Envío: <span>Envío nacional a toda Colombia con seguimiento. Entrega estimada 1-3 días.</span></p>
<p style="font-size:13px;color:#475569">Autenticidad: <span>100% Original garantizado — LAMMAR Perfumería Manizales</span></p>
</div>
<div style="margin-top:16px;display:flex;gap:12px">
<a href="https://wa.me/573046420608?text=Hola%20LAMMAR%20quiero%20${encodeURIComponent(p.nombre)}" style="background:#4B1E28;color:#fff;padding:12px 24px;border-radius:9999px;text-decoration:none;font-weight:600">Consultar por WhatsApp</a>
<a href="/catalogo" style="border:1px solid #4B1E28;color:#4B1E28;padding:12px 24px;border-radius:9999px;text-decoration:none">Ver catálogo</a>
</div>
</div>
</div>
<p style="margin-top:16px;line-height:1.7" itemprop="description">${escapeHtml(p.descripcion)}</p>
<section style="margin-top:24px;border-top:1px solid #e5e5e5;padding-top:16px">
<h2 style="font-family:'Playfair Display',serif;font-size:20px;color:#111">Notas olfativas</h2>
<ul style="margin-top:8px;list-style:disc;padding-left:20px">
<li><strong>Salida:</strong> ${escapeHtml(p.notas.salida.join(', ') || '—')}</li>
<li><strong>Corazón:</strong> ${escapeHtml(p.notas.corazon.join(', ') || '—')}</li>
<li><strong>Fondo:</strong> ${escapeHtml(p.notas.fondo.join(', ') || '—')}</li>
</ul>
</section>
<section style="margin-top:24px;border-top:1px solid #e5e5e5;padding-top:16px">
<h2 style="font-size:18px;color:#111">Detalles del producto</h2>
<table style="width:100%;margin-top:12px;border-collapse:collapse;font-size:14px">
<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-weight:600">Marca</td><td style="padding:8px">${escapeHtml(p.marca)}</td></tr>
<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-weight:600">Tamaño</td><td style="padding:8px">${p.ml} ml</td></tr>
<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-weight:600">Género</td><td style="padding:8px">${escapeHtml(p.genero)}</td></tr>
<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-weight:600">Categoría</td><td style="padding:8px">${escapeHtml(p.categoria)}</td></tr>
<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-weight:600">Precio</td><td style="padding:8px" itemprop="price" content="${p.precio}">${priceVisible} COP</td></tr>
<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-weight:600">Moneda</td><td style="padding:8px">COP</td></tr>
<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-weight:600">Disponibilidad</td><td style="padding:8px">${availabilityText}</td></tr>
<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-weight:600">SKU</td><td style="padding:8px">${p.sku}</td></tr>
<tr style="border-bottom:1px solid #eee"><td style="padding:8px;font-weight:600">Condición</td><td style="padding:8px">Nuevo</td></tr>
<tr><td style="padding:8px;font-weight:600">Envío</td><td style="padding:8px">Envío nacional con tracking</td></tr>
</table>
</section>
<p style="margin-top:24px;font-size:12px;color:#64748b">Compra segura en LAMMAR Perfumería Manizales — Perfumes originales, elegantes y de calidad.</p>
</article>
</main>
</div>
${jsTag}
</body>
</html>
`;
  const outDir = path.join(distDir, 'producto', slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);

  // Brand-prefixed alias e.g. /producto/lattafa-yara for /producto/yara
  const brandSlug = slugify(`${p.marca} ${p.nombre}`);
  if (brandSlug !== slug) {
    const brandUrl = `${SITE_URL}/producto/${brandSlug}`;
    // Keep canonical as original to avoid duplicate SEO, but make brand alias also crawlable with price visible
    const brandHtml = html
      .replace(`<link rel="canonical" href="${url}" />`, `<link rel="canonical" href="${url}" />\n<link rel="alternate" href="${brandUrl}" hreflang="es" />`)
      .replace(`<meta property="og:url" content="${url}" />`, `<meta property="og:url" content="${brandUrl}" />`);
    const brandOutDir = path.join(distDir, 'producto', brandSlug);
    fs.mkdirSync(brandOutDir, { recursive: true });
    fs.writeFileSync(path.join(brandOutDir, 'index.html'), brandHtml);
  }
}

console.log(`✓ Prerender: ${perfumes.length} productos en dist/producto/*/index.html (+ brand aliases)`);

// --- Catalog prerender ---
const catalogLinks = perfumes.map(p => `<a href="/producto/${p.slug}" style="display:block;padding:8px 0;color:#4B1E28;text-decoration:none;border-bottom:1px solid #f1f5f9">${escapeHtml(p.nombre)} — ${escapeHtml(p.marca)} — ${formatPriceCOP(p.precio)} COP — ${escapeHtml(p.genero)} · ${p.ml}ml — ${p.stock>0?'Disponible':'Agotado'}</a>`).join('\n');

const catalogTitle = `Catálogo de Perfumes Originales en Manizales | LAMMAR — ${perfumes.length} Fragancias Elegantes y de Calidad`;
const catalogDesc = `Catálogo completo de ${perfumes.length} perfumes originales, elegantes y de calidad en LAMMAR Manizales. Diseñador, árabes y nicho con precio, marca, tamaño y disponibilidad.`;
const catalogJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Catálogo de Perfumes Originales en Manizales",
  "description": catalogDesc,
  "url": `${SITE_URL}/catalogo`,
  "numberOfItems": perfumes.length,
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": perfumes.length,
    "itemListElement": perfumes.slice(0,20).map((p,i)=>({ "@type":"ListItem","position":i+1,"url":`${SITE_URL}/producto/${p.slug}`,"name":p.nombre }))
  }
};

const catalogHtml = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(catalogTitle)}</title>
<meta name="description" content="${escapeHtml(catalogDesc)}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${SITE_URL}/catalogo" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${escapeHtml(catalogTitle)}" />
<meta property="og:description" content="${escapeHtml(catalogDesc)}" />
<meta property="og:url" content="${SITE_URL}/catalogo" />
<meta property="og:site_name" content="LAMMAR" />
<script type="application/ld+json">
${JSON.stringify(catalogJsonLd, null, 2)}
</script>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
${cssTag}
</head>
<body>
<div id="root">
<header style="padding:24px;text-align:center;font-family:Montserrat,sans-serif">
<p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#C8A450;font-weight:600">LAMMAR — Perfumería Elegante en Manizales</p>
<h1 style="font-family:'Playfair Display',serif;font-size:28px;color:#111;margin:12px 0">Catálogo de Perfumes Originales en Manizales</h1>
<p style="color:#475569;max-width:700px;margin:0 auto">Explora ${perfumes.length} perfumes originales, elegantes y de calidad en LAMMAR Manizales. Todos con precio, marca, tamaño y disponibilidad visible.</p>
</header>
<main style="max-width:1000px;margin:0 auto;padding:0 24px 32px;font-family:Montserrat,sans-serif">
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin-top:24px">
${catalogLinks}
</div>
<p style="margin-top:32px;text-align:center"><a href="/" style="color:#4B1E28">Inicio</a> · <a href="/about" style="color:#4B1E28">Sobre nosotros</a> · <a href="/contact" style="color:#4B1E28">Contacto</a></p>
</main>
</div>
${jsTag}
</body>
</html>
`;
const catalogDir = path.join(distDir, 'catalogo');
fs.mkdirSync(catalogDir, { recursive: true });
fs.writeFileSync(path.join(catalogDir, 'index.html'), catalogHtml);
console.log(`✓ Prerender: catálogo en dist/catalogo/index.html con ${perfumes.length} enlaces`);

// --- Google Merchant Feed (XML) ---
const feedItems = perfumes.map(p => `
  <item>
    <g:id>${p.sku}</g:id>
    <g:title>${escapeHtml(p.nombre)} ${p.ml}ml</g:title>
    <g:description>${escapeHtml(p.descripcion)}</g:description>
    <g:link>${SITE_URL}/producto/${p.slug}</g:link>
    <g:image_link>${p.imageUrl}</g:image_link>
    <g:price>${p.precio} COP</g:price>
    <g:availability>${p.stock>0?'in_stock':'out_of_stock'}</g:availability>
    <g:brand>${escapeHtml(p.marca)}</g:brand>
    <g:condition>new</g:condition>
    <g:mpn>${p.sku}</g:mpn>
    <g:google_product_category>166</g:google_product_category>
    <g:product_type>${escapeHtml(p.categoria)} &gt; ${escapeHtml(p.genero)}</g:product_type>
  </item>`).join('');
const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>LAMMAR — Perfumería en Manizales — Feed de Productos</title>
<link>${SITE_URL}</link>
<description>Feed de ${perfumes.length} perfumes originales de LAMMAR para Google Merchant Center</description>
${feedItems}
</channel>
</rss>`;
fs.writeFileSync(path.join(distDir, 'feed.xml'), feedXml);
fs.writeFileSync(path.join(distDir, 'feed.json'), JSON.stringify(perfumes.map(p=>({id:p.sku, title:`${p.nombre} ${p.ml}ml`, description:p.descripcion, price:p.precio, currency:'COP', availability:p.stock>0?'InStock':'OutOfStock', url:`${SITE_URL}/producto/${p.slug}`, image:p.imageUrl, brand:p.marca, mpn:p.sku, category:p.categoria})), null, 2));
console.log(`✓ Feed generado: dist/feed.xml y dist/feed.json con ${perfumes.length} productos`);
