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
    assert.ok(content.includes('# LAMMAR'), 'should contain H1');
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
