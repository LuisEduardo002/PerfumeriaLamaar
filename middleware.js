/**
 * Vercel Middleware — Markdown content negotiation per https://acceptmarkdown.com
 * This ensures root "/" is handled via Edge (rewrites for "/" are bypassed by static file serving).
 * Shared negotiate logic imported from single source of truth.
 */
import { negotiate } from './src/utils/acceptParser.js';
import { SITE_URL } from './src/config/site.js';

export const config = {
  matcher: '/(.*)',
};

function getMarkdownPath(pathname) {
  if (pathname === '/' || pathname === '' || pathname === '/index.html') return '/__markdown/home.md';
  const clean = pathname.replace(/\/+$/, '') || '/';
  const file = clean.replace(/^\//, '') + '.md';
  return `/__markdown/${file}`;
}

function jsonErrorBody({ status, code, message, hint, path, accept, available }) {
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

export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip static assets, markdown files, and well-known - but NOT /api/ (API must return JSON)
  if (
    pathname.startsWith('/__markdown/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/.well-known/') ||
    pathname === '/favicon-32.png' ||
    pathname === '/favicon-64.png' ||
    pathname === '/apple-touch-icon.png' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/llms.txt' ||
    pathname === '/openapi.json' ||
    pathname.match(/\.(png|jpg|jpeg|webp|svg|css|js|json|xml|ico)$/)
  ) {
    return;
  }

  // API routes — always JSON, regardless of Accept
  if (pathname.startsWith('/api/')) {
    const knownApi = ['/api/catalog', '/api/products', '/api/health'];
    const isProductApi = pathname.startsWith('/api/product/');
    const isKnownApi = knownApi.includes(pathname) || isProductApi;
    if (!isKnownApi) {
      // Check if /api/catalog alias without trailing slash
      if (pathname === '/api/catalog/' || pathname === '/api/products/') {
        // normalize trailing slash
      } else {
        const body = jsonErrorBody({
          status: 404,
          code: 'not_found',
          message: `API endpoint not found: ${pathname}`,
          hint: 'Available API endpoints: GET /api/catalog, GET /api/product/{slug}, GET /api/health. See /openapi.json and /sitemap.xml',
          path: pathname,
        });
        return new Response(body, {
          status: 404,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Vary': 'Accept, Accept-Encoding',
            'Cache-Control': 'public, max-age=60',
          },
        });
      }
    }
    // Known API — return JSON data
    if (pathname === '/api/catalog' || pathname === '/api/products' || pathname === '/api/catalog/' || pathname === '/api/products/') {
      const mdPath = '/__markdown/catalogo.md';
      const mdUrl = new URL(mdPath, request.url);
      let markdownContent = null;
      try {
        const mdResp = await fetch(mdUrl.toString(), { headers: { 'x-middleware-bypass': '1' } });
        if (mdResp.ok) markdownContent = await mdResp.text();
      } catch (e) { console.error('[middleware] fetch failed', e); }
      const body = JSON.stringify({
        data: {
          endpoint: '/api/catalog',
          products: markdownContent ? 'See markdown_url' : null,
          count: 244,
          catalog_url: `${SITE_URL}/catalogo`,
          markdown_url: `${SITE_URL}/__markdown/catalogo.md`,
        },
        links: {
          self: `${SITE_URL}${pathname}`,
          catalog: `${SITE_URL}/catalogo`,
          sitemap: `${SITE_URL}/sitemap.xml`,
          openapi: `${SITE_URL}/openapi.json`,
        },
      }, null, 2);
      return new Response(body, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
          'Cache-Control': 'public, max-age=300',
        },
      });
    }
    if (pathname === '/api/health') {
      const body = JSON.stringify({ status: 'ok', service: 'LAMMAR API', version: '1.0.0', timestamp: new Date().toISOString() }, null, 2);
      return new Response(body, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
          'Cache-Control': 'no-store',
        },
      });
    }
    if (isProductApi) {
      const slug = pathname.replace('/api/product/', '').replace(/\/$/, '');
      const mdPath = `/__markdown/producto/${slug}.md`;
      const mdUrl = new URL(mdPath, request.url);
      try {
        const mdResp = await fetch(mdUrl.toString(), { headers: { 'x-middleware-bypass': '1' } });
        if (mdResp.ok) {
          const md = await mdResp.text();
          const body = JSON.stringify({
            data: { slug, product_url: `${SITE_URL}/producto/${slug}`, markdown: md.slice(0, 5000), markdown_url: `${SITE_URL}${mdPath}` },
            links: { self: `${SITE_URL}${pathname}`, html: `${SITE_URL}/producto/${slug}` },
          }, null, 2);
          return new Response(body, {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Vary': 'Accept, Accept-Encoding',
              'Cache-Control': 'public, max-age=300',
            },
          });
        }
      } catch (e) { console.error('[middleware] fetch failed', e); }
      const body = jsonErrorBody({
        status: 404,
        code: 'not_found',
        message: `Product not found: ${slug}`,
        hint: 'Check slug or browse /api/catalog. See /sitemap.xml for valid product slugs',
        path: pathname,
      });
      return new Response(body, {
        status: 404,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }
    // Fallback unknown API
    const body = jsonErrorBody({
      status: 404,
      code: 'not_found',
      message: `API endpoint not found: ${pathname}`,
      hint: 'Available: /api/catalog, /api/product/{slug}, /api/health',
      path: pathname,
    });
    return new Response(body, {
      status: 404,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
        'Cache-Control': 'public, max-age=60',
      },
    });
  }

  const accept = request.headers.get('accept') || '';
  const wantsJson = accept.toLowerCase().includes('application/json');
  const chosen = negotiate(accept, ['text/markdown', 'text/html', 'application/json'], 'text/html');

  if (chosen === null) {
    if (wantsJson) {
      const body = jsonErrorBody({
        status: 406,
        code: 'not_acceptable',
        message: `Not Acceptable: requested Accept '${accept}' has no available representation.`,
        hint: 'Send Accept: text/html, text/markdown, or application/json. Example: curl -H "Accept: application/json" https://lamaarperfum.store/',
        path: pathname,
        accept,
        available: ['text/html', 'text/markdown', 'application/json'],
      });
      return new Response(body, {
        status: 406,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
          'Cache-Control': 'no-store',
        },
      });
    }
    return new Response(
      `This resource is available in:\n- text/html\n- text/markdown\n- application/json\n\nYou requested: ${accept}\n`,
      {
        status: 406,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  if (chosen === 'application/json') {
    const normalizedPath = pathname === '/index.html' ? '/' : pathname;
    const knownStatic = ['/', '/catalogo', '/privacidad', '/privacy', '/terminos', '/about', '/nosotros', '/contact', '/contacto', '/index.html'];
    const isKnownStatic = knownStatic.includes(pathname) || knownStatic.includes(normalizedPath);
    const isProductRoute = pathname.startsWith('/producto/');
    let isKnown = isKnownStatic;
    if (isProductRoute) {
      const mdPath = getMarkdownPath(pathname);
      const mdCheckUrl = new URL(mdPath, request.url);
      try {
        const check = await fetch(mdCheckUrl.toString(), { method: 'HEAD', headers: { 'x-middleware-bypass': '1' } });
        isKnown = check.ok;
      } catch {
        isKnown = false;
      }
    } else if (!isKnown) {
      isKnown = false;
    }
    if (!isKnown) {
      const body = jsonErrorBody({
        status: 404,
        code: 'not_found',
        message: `Resource not found: ${pathname}`,
        hint: 'Check the URL or browse the catalog at /catalogo. See sitemap at https://lamaarperfum.store/sitemap.xml or llms.txt at https://lamaarperfum.store/llms.txt',
        path: pathname,
      });
      return new Response(body, {
        status: 404,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
          'Cache-Control': 'public, max-age=60',
          'Link': `<${pathname}>; rel="alternate"; type="text/html"`,
        },
      });
    }
    const mdPath = getMarkdownPath(pathname);
    const mdUrl = new URL(mdPath, request.url);
    let markdownContent = null;
    try {
      const mdResp = await fetch(mdUrl.toString(), { headers: { 'x-middleware-bypass': '1' } });
      if (mdResp.ok) markdownContent = await mdResp.text();
    } catch (e) { console.error('[middleware] fetch failed', e); }
    const body = JSON.stringify({
      data: {
        path: pathname,
        url: `${SITE_URL}${pathname}`,
        title: pathname === '/' ? 'LAMMAR | Perfumería en Manizales' : pathname,
        markdown: markdownContent ? markdownContent.slice(0, 4000) : null,
        markdown_url: `${SITE_URL}${mdPath}`,
        html_url: `${SITE_URL}${pathname}`,
      },
      links: {
        self: `${SITE_URL}${pathname}`,
        html: `${SITE_URL}${pathname}`,
        markdown: `${SITE_URL}${mdPath}`,
        sitemap: `${SITE_URL}/sitemap.xml`,
        llms: `${SITE_URL}/llms.txt`,
        openapi: `${SITE_URL}/openapi.json`,
      },
    }, null, 2);
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Vary': 'Accept, Accept-Encoding',
        'Cache-Control': 'public, max-age=300',
        'Link': `<${pathname}>; rel="alternate"; type="text/html"`,
      },
    });
  }

  // Only intercept when markdown is requested; let HTML pass through to static/rewrites
  if (chosen !== 'text/markdown') {
    // Ensure HTML responses still have correct Vary (set via vercel.json global, but middleware can set)
    return;
  }

  // Markdown requested
  const mdPath = getMarkdownPath(pathname);
  const mdUrl = new URL(mdPath, request.url);
  let mdResponse;
  try {
    mdResponse = await fetch(mdUrl.toString(), {
      headers: { 'x-middleware-bypass': '1' },
    });
  } catch {
    mdResponse = null;
  }

  if (!mdResponse || !mdResponse.ok) {
    const notFoundMdUrl = new URL('/__markdown/404.md', request.url);
    try {
      const notFoundResponse = await fetch(notFoundMdUrl.toString(), { headers: { 'x-middleware-bypass': '1' } });
      if (notFoundResponse.ok) {
        const body = await notFoundResponse.arrayBuffer();
        const headers = new Headers();
        headers.set('Content-Type', 'text/markdown; charset=utf-8');
        headers.set('Vary', 'Accept, Accept-Encoding');
        headers.set('Cache-Control', 'public, max-age=60');
        headers.set('Link', `<${pathname}>; rel="alternate"; type="text/html"`);
        headers.append('Link', `<${pathname}>; rel="alternate"; type="application/json"`);
        return new Response(body, { status: 404, headers });
      }
    } catch (e) { console.error('[middleware] fetch failed', e); }
    // Fallback JSON 404 if markdown 404 not available and JSON was not already handled (HTML will be handled by api/negotiate)
    return;
  }

  const mdBody = await mdResponse.arrayBuffer();
  const headers = new Headers();
  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  headers.set('Vary', 'Accept, Accept-Encoding');
  headers.set('Cache-Control', 'public, max-age=300');
  headers.set('Link', `<${pathname}>; rel="alternate"; type="text/html"`);
  headers.append('Link', `<${pathname}>; rel="alternate"; type="application/json"`);
  return new Response(mdBody, {
    status: 200,
    headers,
  });
}
