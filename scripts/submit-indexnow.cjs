/**
 * submit-indexnow.cjs
 * Envía todas las URLs de dist/sitemap.xml a IndexNow (Bing, Yandex, etc.)
 * Uso: npm run indexnow
 * Requiere que https://lamaarperfum.store/<KEY>.txt ya esté desplegado.
 * Fuente única: scripts/utils/site.cjs (SITE_URL, INDEXNOW_KEY). KEY por env INDEXNOW_KEY.
 */
const fs = require('fs');
const path = require('path');
const { SITE_URL, INDEXNOW_KEY } = require('./utils/site.cjs');

const HOST = new URL(SITE_URL).hostname;
const KEY = process.env.INDEXNOW_KEY || INDEXNOW_KEY;
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

async function main() {
  const sitemapPath = path.join(__dirname, '..', 'dist', 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error('No existe dist/sitemap.xml. Corre npm run build primero.');
    process.exit(1);
  }
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).filter(Boolean);
  console.log(`URLs en sitemap: ${urls.length}`);
  console.log(`Host: ${HOST}`);
  console.log(`KeyLocation: ${KEY_LOCATION}`);

  // 1. Verificar que la key está pública (sin exponer la key en logs más de lo necesario)
  try {
    const check = await fetch(KEY_LOCATION);
    const body = (await check.text()).trim();
    if (!check.ok || body !== KEY) {
      console.error(`La key no está pública aún (status ${check.status}). Haz deploy en Vercel primero y repite npm run indexnow`);
      process.exit(1);
    }
    console.log('✓ Key verificada pública');
  } catch (e) {
    console.error('No pude verificar la key (¿sin deploy aún?):', e.message);
    process.exit(1);
  }

  // 2. Enviar en lotes de 10000 (límite IndexNow; tenemos ~253, un lote)
  const batches = [];
  for (let i = 0; i < urls.length; i += 10000) batches.push(urls.slice(i, i + 10000));

  for (const [i, batch] of batches.entries()) {
    const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: batch };
    const res = await fetch('https://api.indexnow.org/indexnow.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
    console.log(`Lote ${i + 1}/${batches.length}: status ${res.status}`);
    if (res.status !== 200 && res.status !== 202) {
      const t = await res.text().catch(() => '');
      console.error('Respuesta:', t.slice(0, 500));
      process.exit(1);
    }
  }
  console.log(`✓ IndexNow: ${urls.length} URLs enviadas a Bing/Yandex`);
}

main();
