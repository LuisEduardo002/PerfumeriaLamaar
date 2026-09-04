/**
 * Vercel Middleware — Markdown content negotiation per https://acceptmarkdown.com
 * This ensures root "/" is handled via Edge (rewrites for "/" are bypassed by static file serving).
 */
export const config = {
  matcher: '/(.*)',
};

function parseAcceptHeader(header) {
  if (!header || header.trim() === '') return [];
  return header
    .split(',')
    .map((part) => {
      const [rawType, ...paramParts] = part.split(';').map((s) => s.trim());
      const type = rawType.toLowerCase().trim();
      let q = 1;
      for (const param of paramParts) {
        const [key, value] = param.split('=').map((s) => s.trim());
        if (key.toLowerCase() === 'q') {
          const parsed = parseFloat(value);
          if (!Number.isNaN(parsed)) q = parsed;
        }
      }
      let specificity = 0;
      if (type === '*/*') specificity = 0;
      else if (type.endsWith('/*')) specificity = 1;
      else specificity = 2;
      return { type, q, specificity };
    })
    .sort((a, b) => {
      if (b.q !== a.q) return b.q - a.q;
      return b.specificity - a.specificity;
    });
}

function matches(acceptType, serverType) {
  const a = acceptType.toLowerCase();
  const s = serverType.toLowerCase();
  if (a === s) return true;
  if (a === '*/*') return true;
  if (a.endsWith('/*')) {
    const prefix = a.slice(0, -2);
    return s.startsWith(prefix + '/');
  }
  return false;
}

function negotiate(acceptHeader, serverTypes = ['text/markdown', 'text/html'], defaultType = 'text/html') {
  if (!acceptHeader || acceptHeader.trim() === '') return defaultType;
  const trimmed = acceptHeader.trim().toLowerCase();
  if (trimmed === '*/*' || trimmed.startsWith('*/*;') || trimmed === '*/*;q=1' || trimmed === '*/*; q=1') {
    const qMatch = trimmed.match(/q=([0-9.]+)/);
    const q = qMatch ? parseFloat(qMatch[1]) : 1;
    if (q === 0) return null;
    return defaultType;
  }
  const parsed = parseAcceptHeader(acceptHeader);
  if (parsed.length === 0) return defaultType;
  if (parsed.length === 1 && parsed[0].type === '*/*') {
    if (parsed[0].q === 0) return null;
    return defaultType;
  }
  let bestType = null;
  let bestScore = -1;
  let bestSpec = -1;
  for (const serverType of serverTypes) {
    let score = 0;
    let spec = -1;
    for (const entry of parsed) {
      if (matches(entry.type, serverType)) {
        if (entry.q === 0) {
          score = 0;
          spec = entry.specificity;
          break;
        }
        score = entry.q;
        spec = entry.specificity;
        break;
      }
    }
    if (score > bestScore || (score === bestScore && spec > bestSpec)) {
      bestScore = score;
      bestSpec = spec;
      bestType = serverType;
    }
  }
  if (bestScore === 0) return null;
  return bestType;
}

function getMarkdownPath(pathname) {
  if (pathname === '/' || pathname === '' || pathname === '/index.html') return '/__markdown/home.md';
  const clean = pathname.replace(/\/+$/, '') || '/';
  const file = clean.replace(/^\//, '') + '.md';
  return `/__markdown/${file}`;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip static assets, markdown files, api, and well-known
  if (
    pathname.startsWith('/__markdown/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/api/') ||
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

  const accept = request.headers.get('accept') || '';
  const chosen = negotiate(accept, ['text/markdown', 'text/html'], 'text/html');

  if (chosen === null) {
    return new Response(
      `This resource is available in:\n- text/html\n- text/markdown\n\nYou requested: ${accept}\n`,
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
        return new Response(body, { status: 404, headers });
      }
    } catch {}
    return;
  }

  const mdBody = await mdResponse.arrayBuffer();
  const headers = new Headers();
  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  headers.set('Vary', 'Accept, Accept-Encoding');
  headers.set('Cache-Control', 'public, max-age=300');
  headers.set('Link', `<${pathname}>; rel="alternate"; type="text/html"`);
  return new Response(mdBody, {
    status: 200,
    headers,
  });
}
