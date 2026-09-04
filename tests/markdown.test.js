import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');
const markdownBase = path.join(distDir, '__markdown');

describe('Markdown generation', () => {
  it('generates markdown for home', () => {
    const p = path.join(markdownBase, 'home.md');
    assert.ok(fs.existsSync(p), 'home.md should exist');
    const content = fs.readFileSync(p, 'utf8');
    assert.ok(content.includes('LAMMAR'), 'should contain brand LAMMAR');
    assert.ok(content.includes('Perfumería') && content.toLowerCase().includes('manizales'), 'should contain Perfumería Manizales');
    assert.ok(content.toLowerCase().includes('originales'), 'should contain originales');
    assert.ok(content.toLowerCase().includes('elegante'), 'should contain elegante');
    assert.ok(content.toLowerCase().includes('calidad'), 'should contain calidad');
    assert.ok(content.includes('Manizales'), 'should mention Manizales');
    assert.ok(content.length > 500, 'should be substantial (500+ chars)');
  });

  it('generates markdown for catalog', () => {
    const p = path.join(markdownBase, 'catalogo.md');
    assert.ok(fs.existsSync(p), 'catalogo.md should exist');
    const content = fs.readFileSync(p, 'utf8');
    assert.ok(content.includes('Catálogo'), 'should contain catalog title');
  });

  it('generates markdown for privacidad', () => {
    const p = path.join(markdownBase, 'privacidad.md');
    assert.ok(fs.existsSync(p), 'privacidad.md should exist');
    const content = fs.readFileSync(p, 'utf8');
    assert.ok(content.includes('Política de Privacidad'), 'should contain title');
    assert.ok(content.includes('WhatsApp'), 'should contain WhatsApp info');
  });

  it('generates markdown for terminos', () => {
    const p = path.join(markdownBase, 'terminos.md');
    assert.ok(fs.existsSync(p), 'terminos.md should exist');
    const content = fs.readFileSync(p, 'utf8');
    assert.ok(content.includes('Términos'), 'should contain title');
  });

  it('generates markdown for producto pages', () => {
    const productoDir = path.join(markdownBase, 'producto');
    assert.ok(fs.existsSync(productoDir), 'producto markdown dir should exist');
    const files = fs.readdirSync(productoDir);
    assert.ok(files.length >= 240, `should have 240+ product markdown files, got ${files.length}`);
    // Check one sample
    const sample = files.find((f) => f.includes('al-noble-ameer'));
    assert.ok(sample, 'should have markdown for al-noble-ameer');
    const content = fs.readFileSync(path.join(productoDir, sample), 'utf8');
    assert.ok(content.includes('AL NOBLE AMEER') || content.includes('Al Noble'), 'should contain product name');
    assert.ok(content.includes('Precio'), 'should contain price');
  });

  it('all markdown files are valid UTF-8 and non-empty', () => {
    const files = [
      path.join(markdownBase, 'home.md'),
      path.join(markdownBase, 'catalogo.md'),
      path.join(markdownBase, 'privacidad.md'),
      path.join(markdownBase, 'terminos.md'),
    ];
    for (const f of files) {
      const content = fs.readFileSync(f, 'utf8');
      assert.ok(content.length > 100, `${path.basename(f)} should not be empty`);
    }
  });
});

describe('Machine-readable files', () => {
  it('sitemap.xml exists and is valid', () => {
    const p = path.join(distDir, 'sitemap.xml');
    assert.ok(fs.existsSync(p), 'sitemap.xml should exist');
    const content = fs.readFileSync(p, 'utf8');
    assert.ok(content.includes('<urlset'), 'should be valid sitemap');
    assert.ok(content.includes('https://lamaarperfum.store'), 'should contain correct domain');
  });

  it('robots.txt exists and allows AI bots', () => {
    const p = path.join(distDir, 'robots.txt');
    // robots.txt is in public, copied to dist
    const publicRobots = path.join(path.dirname(distDir), 'public', 'robots.txt');
    const content = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : fs.readFileSync(publicRobots, 'utf8');
    assert.ok(content.includes('User-agent: *'), 'should have wildcard agent');
    assert.ok(content.includes('Sitemap:'), 'should contain sitemap reference');
  });

  it('llms.txt exists', () => {
    const p = path.join(distDir, 'llms.txt');
    const publicLlms = path.join(path.dirname(distDir), 'public', 'llms.txt');
    const exists = fs.existsSync(p) || fs.existsSync(publicLlms);
    assert.ok(exists, 'llms.txt should exist');
  });
});

describe('Homepage structured data and metadata', () => {
  const indexPath = path.join(distDir, 'index.html');
  let indexHtml = '';

  it('index.html exists', () => {
    assert.ok(fs.existsSync(indexPath), 'dist/index.html should exist');
    indexHtml = fs.readFileSync(indexPath, 'utf8');
  });

  it('has canonical URL', () => {
    assert.ok(indexHtml.includes('<link rel="canonical" href="https://lamaarperfum.store/" />'),
      'should have canonical link with absolute URL');
  });

  it('has html lang attribute', () => {
    assert.ok(indexHtml.includes('<html lang="es">'), 'should have lang="es" on html element');
  });

  it('has og:type meta tag', () => {
    assert.ok(indexHtml.includes('<meta property="og:type" content="website" />'),
      'should have og:type meta tag');
  });

  it('has absolute og:image URL', () => {
    assert.ok(indexHtml.includes('<meta property="og:image" content="https://lamaarperfum.store/images/og-image.jpg" />'),
      'should have absolute og:image URL');
  });

  it('has Organization JSON-LD as primary identity', () => {
    assert.ok(indexHtml.includes('"@type": ["Organization", "LocalBusiness", "OnlineStore"]'),
      'should have Organization as primary @type in JSON-LD');
  });

  it('has logo in Organization JSON-LD', () => {
    assert.ok(indexHtml.includes('"logo": "https://lamaarperfum.store/images/og-image.jpg"'),
      'should have logo property in Organization JSON-LD');
  });

  it('has og:url and og:site_name', () => {
    assert.ok(indexHtml.includes('<meta property="og:url" content="https://lamaarperfum.store/" />'),
      'should have og:url');
    assert.ok(indexHtml.includes('<meta property="og:site_name" content="LAMMAR" />'),
      'should have og:site_name');
  });
});

describe('Trust anchor pages (About, Contact, Privacy)', () => {
  const checkAnchor = (file, minLength = 500) => {
    const p = path.join(markdownBase, file);
    assert.ok(fs.existsSync(p), `${file} should exist`);
    const content = fs.readFileSync(p, 'utf8');
    assert.ok(content.length >= minLength, `${file} should have at least ${minLength} chars (got ${content.length})`);
    return content;
  };

  it('generates markdown for about', () => {
    const c = checkAnchor('about.md');
    assert.ok(c.includes('Sobre LAMMAR') || c.includes('LAMMAR'), 'about should contain brand');
    assert.ok(c.includes('Manizales'), 'about should mention Manizales');
  });

  it('generates markdown for nosotros (ES alias)', () => {
    checkAnchor('nosotros.md');
  });

  it('generates markdown for contact', () => {
    const c = checkAnchor('contact.md');
    assert.ok(c.includes('Contacto') || c.includes('contact'), 'contact should have title');
    assert.ok(c.includes('304 6420608'), 'contact should contain phone');
    assert.ok(c.includes('amazingstoresoporte@gmail.com'), 'contact should contain email');
    assert.ok(c.includes('Manizales'), 'contact should contain address');
  });

  it('generates markdown for contacto (ES alias)', () => {
    checkAnchor('contacto.md');
  });

  it('generates markdown for privacy (EN alias)', () => {
    const c = checkAnchor('privacy.md');
    assert.ok(c.includes('Política de Privacidad') || c.includes('Privacy'), 'privacy should contain title');
  });

  it('sitemap includes trust anchor URLs', () => {
    const p = path.join(distDir, 'sitemap.xml');
    const sitemap = fs.readFileSync(p, 'utf8');
    for (const url of ['/about', '/contact', '/privacy', '/privacidad']) {
      assert.ok(sitemap.includes(`<loc>https://lamaarperfum.store${url}</loc>`), `sitemap should contain ${url}`);
    }
  });

  it('dist index fallback contains trust anchor links', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
    assert.ok(indexHtml.includes('href="/about"'), 'index fallback should link to /about');
    assert.ok(indexHtml.includes('href="/contact"'), 'index fallback should link to /contact');
    assert.ok(indexHtml.includes('href="/privacy"'), 'index fallback should link to /privacy');
  });
});

describe('Brand name discoverability (NAP + apex redirect)', () => {
  it('vercel.json has www -> apex redirect to avoid masking apex', () => {
    const vercel = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
    assert.ok(Array.isArray(vercel.redirects), 'vercel.json should have redirects');
    const wwwRedirect = vercel.redirects.find(r => r.has && r.has.some(h => h.value === 'www.lamaarperfum.store'));
    assert.ok(wwwRedirect, 'should have www.lamaarperfum.store host redirect');
    assert.equal(wwwRedirect.destination, 'https://lamaarperfum.store/$1');
    assert.equal(wwwRedirect.permanent, true);
  });

  it('sitemap and canonical use apex domain (not www)', () => {
    const sitemap = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
    assert.ok(sitemap.includes('https://lamaarperfum.store/'), 'sitemap should use apex');
    assert.ok(!sitemap.includes('https://www.lamaarperfum.store'), 'sitemap should not use www');
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
    assert.ok(indexHtml.includes('<link rel="canonical" href="https://lamaarperfum.store/"'), 'canonical should be apex');
    assert.ok(indexHtml.includes('<meta property="og:url" content="https://lamaarperfum.store/"'), 'og:url should be apex');
  });

  it('JSON-LD and Footer NAP are consistent', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
    const footer = fs.readFileSync(path.join(__dirname, '..', 'src/components/layout/Footer.jsx'), 'utf8');
    // Check JSON-LD NAP
    assert.ok(indexHtml.includes('"streetAddress": "Centro Comercial Los Fundadores, Local 101"'));
    assert.ok(indexHtml.includes('"postalCode": "170001"'));
    assert.ok(indexHtml.includes('"telephone": "+57 304 6420608"'));
    assert.ok(indexHtml.includes('"email": "amazingstoresoporte@gmail.com"'));
    // Check sameAs includes all 4 and matches footer
    assert.ok(indexHtml.includes('https://www.instagram.com/lamaar_perfumm/'), 'JSON-LD should have lamaar_perfumm Instagram');
    assert.ok(indexHtml.includes('https://www.facebook.com/profile.php?id=61557995259913'), 'JSON-LD should have Facebook profile id');
    assert.ok(indexHtml.includes('https://www.tiktok.com/@lamaar.perfume'), 'JSON-LD should have TikTok');
    assert.ok(indexHtml.includes('https://wa.me/573046420608'));
    // Footer should have same
    assert.ok(footer.includes('https://www.instagram.com/lamaar_perfumm/'));
    assert.ok(footer.includes('https://www.facebook.com/profile.php?id=61557995259913'));
    assert.ok(footer.includes('https://www.tiktok.com/@lamaar.perfume'));
    // Footer NAP full address
    assert.ok(footer.includes('Centro Comercial Los Fundadores, Local 101'), 'Footer should have full street');
    assert.ok(footer.includes('Manizales, Caldas 170001, Colombia'));
    assert.ok(footer.includes('amazingstoresoporte@gmail.com'));
    assert.ok(footer.includes('+57 304 6420608'));
  });

  it('brand LAMMAR appears in key SEO signals', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
    assert.ok(indexHtml.includes('<title>LAMMAR'), 'title should start with LAMMAR');
    assert.ok(indexHtml.includes('Perfumería'), 'fallback should contain Perfumería');
    assert.ok(indexHtml.includes('"name": "LAMMAR"'), 'JSON-LD name should be LAMMAR');
    assert.ok(indexHtml.includes('"alternateName": "LAMAAR PERFUM"'));
    assert.ok(indexHtml.includes('content="LAMMAR"') || indexHtml.includes('og:site_name" content="LAMMAR"'), 'og:site_name should be LAMMAR');
  });

  it('homepage H1 is keyword-rich for perfumería Manizales originales elegante calidad', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
    // Check fallback H1 (SSR) and title contain target keywords
    assert.match(indexHtml, /<h1[^>]*>[^<]*Perfumería[^<]*Manizales[^<]*Originales[^<]*Elegantes[^<]*Calidad[^<]*<\/h1>/i, 'H1 should contain Perfumería Manizales Originales Elegantes Calidad');
    const lower = indexHtml.toLowerCase();
    assert.ok(lower.includes('perfumería') && lower.includes('manizales'), 'should have perfumería Manizales');
    assert.ok(lower.includes('originales'), 'should have originales');
    assert.ok(lower.includes('elegante'), 'should have elegante');
    assert.ok(lower.includes('calidad'), 'should have calidad');
  });

  it('homepage has proper H2/H3 hierarchy with Manizales keywords', () => {
    const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
    // Count H2s with Manizales
    const h2Matches = [...indexHtml.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)].map(m => m[1].toLowerCase());
    assert.ok(h2Matches.length >= 3, `should have at least 3 H2s, got ${h2Matches.length}`);
    const h2WithManizales = h2Matches.filter(t => t.includes('manizales')).length;
    assert.ok(h2WithManizales >= 2, `at least 2 H2s should mention Manizales, got ${h2WithManizales}`);
    const h3Matches = [...indexHtml.matchAll(/<h3[^>]*>(.*?)<\/h3>/gi)].map(m => m[1].toLowerCase());
    assert.ok(h3Matches.some(t => t.includes('caballero') && t.includes('original')), 'H3 Caballero should be keyword-rich');
    assert.ok(h3Matches.some(t => t.includes('dama') && t.includes('elegante')), 'H3 Dama should be keyword-rich');
  });
});
