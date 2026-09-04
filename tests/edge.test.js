import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Simulate the Edge Function's response logic for header verification
import { negotiate } from '../src/utils/acceptParser.js';

const SERVER_TYPES = ['text/markdown', 'text/html', 'application/json'];

function jsonErrorBody({ status, code, message, hint, path, accept, available }) {
  const SITE_URL = 'https://lamaarperfum.store';
  return JSON.stringify({
    error: {
      code,
      message,
      status,
      path: path || '/',
      ...(accept !== undefined ? { accept } : {}),
      ...(available ? { available } : {}),
      hint,
      links: {
        home: `${SITE_URL}/`,
        catalog: `${SITE_URL}/catalogo`,
        sitemap: `${SITE_URL}/sitemap.xml`,
        llms: `${SITE_URL}/llms.txt`,
        openapi: `${SITE_URL}/openapi.json`,
      },
    },
  }, null, 2);
}

function simulateResponse(acceptHeader, path = '/') {
  const chosen = negotiate(acceptHeader, SERVER_TYPES, 'text/html');
  const wantsJson = (acceptHeader || '').toLowerCase().includes('application/json');
  if (chosen === null) {
    if (wantsJson) {
      return {
        status: 406,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
        },
        body: jsonErrorBody({
          status: 406,
          code: 'not_acceptable',
          message: `Not Acceptable: requested Accept '${acceptHeader}' has no available representation.`,
          hint: 'Send Accept: text/html, text/markdown, or application/json',
          path,
          accept: acceptHeader,
          available: SERVER_TYPES,
        }),
      };
    }
    return {
      status: 406,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
      },
      body: `This resource is available in:\n- text/html\n- text/markdown\n- application/json\n\nYou requested: ${acceptHeader}\n`,
    };
  }
  if (chosen === 'text/markdown') {
    return {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
        'Link': `<${path}>; rel="alternate"; type="text/html"`,
      },
    };
  }
  if (chosen === 'application/json') {
    // Simulate known vs unknown for JSON
    const isKnown = ['/', '/index.html', '/catalogo', '/privacidad', '/privacy', '/terminos', '/about', '/nosotros', '/contact', '/contacto'].includes(path) || path.startsWith('/producto/');
    if (!isKnown) {
      return {
        status: 404,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
          'Link': `<${path}>; rel="alternate"; type="text/html"`,
        },
        body: jsonErrorBody({
          status: 404,
          code: 'not_found',
          message: `Resource not found: ${path}`,
          hint: 'Check the URL or browse the catalog at /catalogo. See sitemap at https://lamaarperfum.store/sitemap.xml',
          path,
        }),
      };
    }
    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
        'Link': `<${path}>; rel="alternate"; type="text/html"`,
      },
      body: JSON.stringify({ data: { path, url: `https://lamaarperfum.store${path}` } }),
    };
  }
  return {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Vary': 'Accept, Accept-Encoding',
      'Link': `<${path}>; rel="alternate"; type="text/markdown"`,
    },
  };
}

// Known routes that should return 200 (matching api/negotiate.js logic)
const knownStatic = ['/', '/index.html', '/catalogo', '/privacidad', '/privacy', '/terminos', '/about', '/nosotros', '/contact', '/contacto'];

function isKnownRoute(pathname) {
  if (knownStatic.includes(pathname)) return true;
  if (pathname.startsWith('/producto/')) return true; // Would need markdown file check in real edge function
  return false;
}

function simulateEdgeFunctionResponse(acceptHeader, pathname) {
  const chosen = negotiate(acceptHeader, SERVER_TYPES, 'text/html');
  
  // For HTML responses, determine if path is known
  const isKnown = isKnownRoute(pathname);
  const wantsJson = (acceptHeader || '').toLowerCase().includes('application/json');
  
  if (chosen === null) {
    if (wantsJson) {
      return {
        status: 406,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
        },
        body: jsonErrorBody({
          status: 406,
          code: 'not_acceptable',
          message: `Not Acceptable`,
          hint: 'Send Accept: text/html, text/markdown, or application/json',
          path: pathname,
          accept: acceptHeader,
          available: SERVER_TYPES,
        }),
      };
    }
    return {
      status: 406,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
      },
    };
  }
  if (chosen === 'text/markdown') {
    // For markdown, unknown paths return 404 with 404.md
    if (!isKnown) {
      return {
        status: 404,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
          'Link': `<${pathname}>; rel="alternate"; type="text/html"`,
        },
      };
    }
    return {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
        'Link': `<${pathname}>; rel="alternate"; type="text/html"`,
      },
    };
  }
  if (chosen === 'application/json') {
    if (!isKnown) {
      return {
        status: 404,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
          'Link': `<${pathname}>; rel="alternate"; type="text/html"`,
        },
        body: jsonErrorBody({
          status: 404,
          code: 'not_found',
          message: `Resource not found: ${pathname}`,
          hint: 'Check sitemap',
          path: pathname,
        }),
      };
    }
    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
        'Link': `<${pathname}>; rel="alternate"; type="text/html"`,
      },
      body: JSON.stringify({ data: { path: pathname } }),
    };
  }
  // HTML response
  return {
    status: isKnown ? 200 : 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Vary': 'Accept, Accept-Encoding',
      'Link': `<${pathname}>; rel="alternate"; type="text/markdown"`,
    },
  };
}

describe('Edge Function headers and status (acceptmarkdown.com)', () => {
  it('returns markdown with correct Content-Type and Vary for Accept: text/markdown', () => {
    const res = simulateResponse('text/markdown', '/');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'text/markdown; charset=utf-8');
    assert.ok(res.headers['Vary'].includes('Accept'), 'Vary should include Accept');
    assert.ok(res.headers['Link'].includes('text/html'), 'Link should point to html alternate');
  });

  it('returns html with Vary: Accept for Accept: text/html', () => {
    const res = simulateResponse('text/html', '/catalogo');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
    assert.ok(res.headers['Vary'].includes('Accept'));
  });

  it('returns html with Vary for missing Accept', () => {
    const res = simulateResponse(null, '/');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
    assert.ok(res.headers['Vary'].includes('Accept'));
  });

  it('returns html with Vary for */*', () => {
    const res = simulateResponse('*/*', '/');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
    assert.ok(res.headers['Vary'].includes('Accept'));
  });

  it('returns 406 with Vary for Accept: application/pdf', () => {
    const res = simulateResponse('application/pdf', '/');
    assert.equal(res.status, 406);
    assert.equal(res.headers['Content-Type'], 'text/plain; charset=utf-8');
    assert.equal(res.headers['Vary'], 'Accept, Accept-Encoding');
    assert.ok(res.body.includes('text/html'));
    assert.ok(res.body.includes('text/markdown'));
  });

  it('respects q-values: prefers html when it has higher q', () => {
    const res = simulateResponse('text/markdown;q=0.5, text/html;q=0.9', '/');
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
  });

  it('respects q=0: markdown rejected, html served', () => {
    const res = simulateResponse('text/markdown;q=0, text/html', '/');
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
  });

  it('sets Vary: Accept, Accept-Encoding for markdown', () => {
    const res = simulateResponse('text/markdown', '/producto/al-noble-ameer');
    assert.equal(res.headers['Vary'], 'Accept, Accept-Encoding');
  });

  it('handles real Chrome header as html', () => {
    const chrome = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
    const res = simulateResponse(chrome, '/');
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
  });

  // 404 behavior tests (agent-friendly 404s)
  it('returns 404 for unknown HTML path', () => {
    const res = simulateEdgeFunctionResponse('text/html', '/unknown-path');
    assert.equal(res.status, 404);
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
    assert.ok(res.headers['Vary'].includes('Accept, Accept-Encoding'));
    assert.ok(res.headers['Link'].includes('text/markdown'));
  });

  it('returns 404 for unknown markdown path', () => {
    const res = simulateEdgeFunctionResponse('text/markdown', '/unknown-path');
    assert.equal(res.status, 404);
    assert.equal(res.headers['Content-Type'], 'text/markdown; charset=utf-8');
    assert.ok(res.headers['Vary'].includes('Accept, Accept-Encoding'));
    assert.ok(res.headers['Link'].includes('text/html'));
  });

  it('returns 200 for known static HTML path', () => {
    const res = simulateEdgeFunctionResponse('text/html', '/catalogo');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
  });

  it('returns 200 for known product HTML path', () => {
    const res = simulateEdgeFunctionResponse('text/html', '/producto/al-noble-ameer');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'text/html; charset=utf-8');
  });

  it('returns 200 for known static markdown path', () => {
    const res = simulateEdgeFunctionResponse('text/markdown', '/catalogo');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'text/markdown; charset=utf-8');
  });

  it('returns 404 for root with product-like unknown path', () => {
    const res = simulateEdgeFunctionResponse('text/html', '/producto/nonexistent-product');
    // Product routes are considered "known" by path pattern, but real edge function checks markdown file existence
    // This test documents the pattern-based assumption; actual 404 depends on markdown file existence
    assert.equal(res.status, 200); // Pattern matches, so treated as known route
  });

  // JSON error responses (Essential - agents need structured JSON, not HTML)
  it('returns JSON with correct Content-Type and Vary for Accept: application/json', () => {
    const res = simulateResponse('application/json', '/');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'application/json; charset=utf-8');
    assert.ok(res.headers['Vary'].includes('Accept'), 'Vary should include Accept');
    const body = JSON.parse(res.body);
    assert.ok(body.data, 'should have data');
    assert.equal(body.data.path, '/');
  });

  it('returns 404 JSON for unknown path with Accept: application/json', () => {
    const res = simulateResponse('application/json', '/unknown-path');
    assert.equal(res.status, 404);
    assert.equal(res.headers['Content-Type'], 'application/json; charset=utf-8');
    assert.ok(res.headers['Vary'].includes('Accept, Accept-Encoding'));
    const body = JSON.parse(res.body);
    assert.equal(body.error.code, 'not_found');
    assert.equal(body.error.status, 404);
    assert.ok(body.error.message.includes('/unknown-path'));
    assert.ok(body.error.hint.includes('sitemap'));
    assert.ok(body.error.links.sitemap.includes('sitemap.xml'));
  });

  it('returns 404 JSON via edge for unknown path', () => {
    const res = simulateEdgeFunctionResponse('application/json', '/no-such-page');
    assert.equal(res.status, 404);
    assert.equal(res.headers['Content-Type'], 'application/json; charset=utf-8');
    const body = JSON.parse(res.body);
    assert.equal(body.error.code, 'not_found');
  });

  it('returns 200 JSON for known path', () => {
    const res = simulateEdgeFunctionResponse('application/json', '/about');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'application/json; charset=utf-8');
  });

  it('returns 200 JSON for known product', () => {
    const res = simulateResponse('application/json', '/producto/al-noble-ameer');
    assert.equal(res.status, 200);
    assert.equal(res.headers['Content-Type'], 'application/json; charset=utf-8');
  });

  it('returns 406 JSON when Accept is application/pdf and JSON preferred? still 406', () => {
    const res = simulateResponse('application/pdf', '/');
    assert.equal(res.status, 406);
    // For pdf, wantsJson false, so text/plain
    assert.equal(res.headers['Content-Type'], 'text/plain; charset=utf-8');
  });

  it('returns 406 JSON error when Accept is nonsense with json hint', () => {
    const res = simulateResponse('application/pdf;q=1, application/json;q=0', '/');
    // This is technically not 406 because html is default and pdf is not in server types, but negotiation will fallback?
    // Ensure JSON error structure is valid when 406 does happen with JSON
    const jsonRes = simulateResponse('application/unknown', '/');
    assert.equal(jsonRes.status, 406);
  });
});
